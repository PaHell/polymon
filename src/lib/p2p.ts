import { PUBLIC_P2P_PREFIX } from "$env/static/public";
import { Peer, type DataConnection } from "peerjs";
import { writable, get } from "svelte/store";

export const username = writable<string | undefined>(undefined);
export const peerIdentities = writable<Record<string, string>>({});

type P2PMessage =
      | { type: 'request'; id: string; action: string; payload?: unknown }
      | { type: 'response'; id: string; payload?: unknown }
      | { type: 'error'; id: string; error: string };

const RESPONSE_TIMEOUT = 5000;

export const p2p = function () {
      let isHost = false;
      let peer: Peer | null = null;
      let connections: DataConnection[] = [];
      const { subscribe } = writable<unknown>();

      const pendingRequests = new Map<
            string,
            { resolve: (data: unknown) => void; reject: (err: Error) => void; timeout: ReturnType<typeof setTimeout> }
      >();

      const requestHandlers = new Map<string, (payload: unknown, connectionId: DataConnection["connectionId"]) => Promise<unknown>>();

      function handleIncomingMessage(conn: DataConnection, message: P2PMessage) {
            switch (message.type) {
                  case 'request':
                        (async () => {
                              const { id, action, payload } = message;
                              const handler = requestHandlers.get(action);
                              if (!handler) {
                                    conn.send({ type: 'error', id, error: `No handler for action: ${action}` });
                                    return;
                              }
                              try {
                                    const result = await handler(payload, conn.connectionId);
                                    conn.send({ type: 'response', id, payload: result });
                              } catch (err) {
                                    conn.send({ type: 'error', id, error: err.message || 'Unknown error' });
                              }
                        })();
                        break;

                  case 'response':
                  case 'error':
                        const pending = pendingRequests.get(message.id);
                        if (!pending) return;
                        clearTimeout(pending.timeout);
                        pendingRequests.delete(message.id);
                        if (message.type === 'response') {
                              pending.resolve(message.payload);
                        } else {
                              pending.reject(new Error(message.error));
                        }
                        break;

                  default:
                        console.warn('Unknown message type:', message);
            }
      }

      function sendIdentify(conn: DataConnection) {
            const name = get(username);
            if (!name) return;
            const msg: P2PMessage = {
                  type: 'request',
                  id: crypto.randomUUID(),
                  action: 'identify',
                  payload: name
            };
            conn.send(msg);
      }

      return {
            subscribe,

            getPeerId: () => peer?.id,
            isHost: () => isHost,

            connectToBroker: (code?: string) => {
                  return new Promise((resolve, reject) => {
                        if (peer) peer.destroy();
                        peer = code ? new Peer(PUBLIC_P2P_PREFIX + code) : new Peer();
                        peer.on('open', id => {
                              console.log('Connected to broker:', id);
                              resolve(id);
                        });
                        peer.on('error', reject);
                  });
            },

            connectToPeer: (code: string) => {
                  return new Promise((resolve, reject) => {
                        if (!peer) throw new Error('Peer not initialized');
                        const conn = peer.connect(PUBLIC_P2P_PREFIX + code);
                        conn.on('open', () => {
                              console.log('Connected to host:', conn);
                              isHost = false;
                              connections.push(conn);
                              sendIdentify(conn);
                              resolve(true);
                        });
                        conn.on('data', (data) => handleIncomingMessage(conn, data as P2PMessage));
                        conn.on('error', reject);
                        conn.on('close', () => {
                              console.log('Connection closed:', conn.peer);
                              peerIdentities.update(map => {
                                    delete map[conn.peer];
                                    return { ...map };
                              });
                              connections = connections.filter(c => c !== conn);
                        });

                        peerIdentities.set({
                              [peer.id]: get(username) || 'You'
                        });

                        // Handle incoming identity payloads
                        p2p.registerHandler<string, void>('identify', async (name, conn) => {
                              peerIdentities.update(map => ({ ...map, [conn]: name }));
                        });
                  });
            },

            listenForConnections: () => {
                  if (!peer) throw new Error('Peer not initialized');
                  isHost = true;
                  peer.on('connection', (conn) => {
                        console.log('New connection from:', conn.peer);
                        connections.push(conn);
                        conn.on('data', (data) => handleIncomingMessage(conn, data as P2PMessage));
                        conn.on('open', () => sendIdentify(conn));
                        conn.on('close', () => {
                              console.log('Connection closed:', conn.peer);
                              peerIdentities.update(map => {
                                    delete map[conn.peer];
                                    return { ...map };
                              });
                              connections = connections.filter(c => c !== conn);
                        });
                  });

                  peerIdentities.set({
                        [peer.id]: get(username) || 'You'
                  });

                  // Handle incoming identity payloads
                  p2p.registerHandler<string, void>('identify', async (name, conn) => {
                        peerIdentities.update(map => ({ ...map, [conn]: name }));
                  });
            },

            disconnect: () => {
                  connections.forEach(conn => {
                        conn.removeAllListeners();
                        conn.close();
                  });
                  connections = [];
                  if (peer) {
                        peer.removeAllListeners();
                        peer.destroy();
                        peer = null;
                  }
                  pendingRequests.clear();
                  peerIdentities.set({});
            },

            sendRequest: function <In, Out>(action: string, payload?: In): Promise<Out> {
                  if (!connections.length || !peer) throw new Error('No active connection');
                  const id = crypto.randomUUID();
                  const message: P2PMessage = { type: 'request', id, action, payload };

                  // self handle request
                  const handler = requestHandlers.get(action);
                  if (handler) {
                        handler(payload, peer.id);
                  }

                  return new Promise((resolve, reject) => {
                        const timeout = setTimeout(() => {
                              pendingRequests.delete(id);
                              reject(new Error('Request timed out'));
                        }, RESPONSE_TIMEOUT);

                        pendingRequests.set(id, { resolve, reject, timeout });
                        connections[0].send(message);
                  });
            },

            broadcastRequest: function <In, Out>(action: string, payload?: In): Promise<Out[]> {
                  if (!connections.length || !peer) throw new Error('No active connections');
                  const id = crypto.randomUUID();
                  const message: P2PMessage = { type: 'request', id, action, payload };

                  // self handle request
                  const handler = requestHandlers.get(action);
                  if (handler) {
                        handler(payload, peer.id);
                  }

                  return Promise.allSettled(
                        connections.map(conn => {
                              return new Promise<Out>((resolve, reject) => {
                                    const reqId = crypto.randomUUID();
                                    const msg = { ...message, id: reqId };
                                    const timeout = setTimeout(() => {
                                          pendingRequests.delete(reqId);
                                          reject(new Error('Request timed out'));
                                    }, RESPONSE_TIMEOUT);

                                    pendingRequests.set(reqId, { resolve, reject, timeout });
                                    conn.send(msg);
                              });
                        })
                  ).then(results =>
                        results
                              .filter(r => r.status === 'fulfilled')
                              .map((r: unknown) => r.value)
                  );
            },

            registerHandler: function <In, Out>(
                  action: string,
                  handler: (payload: In, connectionId: DataConnection["connectionId"]) => Promise<Out> | Out
            ) {
                  requestHandlers.set(action, handler);
            },
      };
}();
