import { PUBLIC_P2P_PREFIX } from "$env/static/public";
import { Peer, type DataConnection } from "peerjs";
import { writable, get } from "svelte/store";

export const username = writable<string | undefined>(undefined);

type P2PMessage =
      | { type: 'request'; id: string; action: string; payload?: unknown }
      | { type: 'response'; id: string; payload?: unknown }
      | { type: 'error'; id: string; error: string };

const RESPONSE_TIMEOUT = 5000;

type Identification = {
      username: string;
      seed: string;
};

export type P2P = {
      isHost: boolean;
      connectedLobbyCode: string | undefined;
      peer: Peer | null;
      connections: DataConnection[];
      identities: Record<string, Identification>;
}

export const p2p = function () {
      const store = writable<P2P>({
            isHost: false,
            connectedLobbyCode: undefined,
            peer: null,
            connections: [],
            identities: {}
      });
      const { subscribe, update } = store;

      const pendingRequests = new Map<
            string,
            { resolve: (data: unknown) => void; reject: (err: Error) => void; timeout: ReturnType<typeof setTimeout> }
      >();

      const requestHandlers = new Map<string, (payload: unknown, peerId: string) => Promise<unknown>>();

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
                                    const result = await handler(payload, conn.peer);
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

            connectToBroker: (code?: string) => {
                  return new Promise((resolve, reject) => {
                        update((state) => {
                              if (state.peer) state.peer.destroy();
                              state.peer = code ? new Peer(PUBLIC_P2P_PREFIX + code) : new Peer();
                              state.peer.on('open', id => {
                                    update((state2) => {
                                          console.log('Connected to broker:', id);
                                          state2.connectedLobbyCode = code;
                                          resolve(id);
                                          return state2;
                                    });
                              });
                              state.peer.on('error', reject);
                              return state;
                        });
                  });
            },

            connectToPeer: (code: string) => {
                  const _state = get(store);
                  return new Promise((resolve, reject) => {
                        if (!_state.peer) throw new Error('Peer not initialized');
                        const conn = _state.peer.connect(PUBLIC_P2P_PREFIX + code);
                        conn.on('open', () => {
                              update((state) => {
                                    console.log('Connected to host:', conn);
                                    state.isHost = false;
                                    state.connectedLobbyCode = code;
                                    state.connections.push(conn);
                                    sendIdentify(conn);
                                    resolve(true);
                                    return state;
                              });
                        });
                        conn.on('data', (data) => handleIncomingMessage(conn, data as P2PMessage));
                        conn.on('error', reject);
                        conn.on('close', () => {
                              console.log('Connection closed:', conn.peer);
                              update((state) => {
                                    delete state.identities[conn.peer];
                                    state.connections = state.connections.filter(c => c !== conn);
                                    state.connectedLobbyCode = undefined;
                                    return state;
                              });
                        });

                        update((state) => {
                              if (!state.peer) throw new Error('Peer not initialized');
                              state.identities[state.peer.id] = {
                                    username: get(username) || 'You',
                                    seed: crypto.randomUUID()
                              }
                              return state;
                        });

                        // Handle incoming identity payloads
                        p2p.registerHandler<Identification, void>('identify', async (obj, peerId) => {
                              update((state) => {
                                    state.identities[peerId] = obj;
                                    return state;
                              });
                        });
                  });
            },

            listenForConnections: () => {
                  update((state) => {
                        if (!state.peer) throw new Error('Peer not initialized');
                        state.isHost = true;
                        state.peer.on('connection', (conn) => {
                              update((state) => {
                                    console.log('New connection from:', conn.peer);
                                    state.connections.push(conn);
                                    conn.on('data', (data) => handleIncomingMessage(conn, data as P2PMessage));
                                    conn.on('open', () => sendIdentify(conn));
                                    conn.on('close', () => {
                                          console.log('Connection closed:', conn.peer);
                                          delete state.identities[conn.peer];
                                          state.connections = state.connections.filter(c => c !== conn);
                                    });
                                    return state;
                              });
                        });
                        state.identities[state.peer.id] = {
                              username: get(username) || 'You',
                              seed: crypto.randomUUID()
                        }
                        return state;
                  });


                  // Handle incoming identity payloads
                  p2p.registerHandler<Identification, void>('identify', async (obj, peerId) => {
                        update((state) => {
                              state.identities[peerId] = obj;
                              return state;
                        });
                  });
            },

            disconnectAll: () => {
                  update((state) => {
                        state.connections.forEach(conn => {
                              conn.removeAllListeners();
                              conn.close();
                        });
                        state.connections = [];
                        if (state.peer) {
                              state.peer.removeAllListeners();
                              state.peer.destroy();
                              state.peer = null;
                        }
                        pendingRequests.clear();
                        state.identities = {};
                        state.connectedLobbyCode = undefined;
                        return state;
                  });
            },

            disconnectFromPeer: (peer: string) => {
                  update((state) => {
                        const conn = state.connections.find(c => c.peer === peer);
                        if (conn) {
                              conn.removeAllListeners();
                              conn.close();
                              state.connections = state.connections.filter(c => c !== conn);
                              delete state.identities[peer];
                        }
                        return state;
                  });
            },

            sendRequest: function <In, Out>(action: string, peer: string, payload?: In): Promise<Out> {
                  const state = get(store);
                  if (!state.peer) throw new Error('Peer not initialized');
                  const conn = state.connections.find(c => c.peer === peer);
                  if (!conn) throw new Error(`Connection with ID ${peer} not found`);
                  const id = crypto.randomUUID();
                  const message: P2PMessage = { type: 'request', id, action, payload };

                  // self handle request
                  const handler = requestHandlers.get(action);
                  if (handler) {
                        handler(payload, state.peer.id);
                  }

                  return new Promise((resolve, reject) => {
                        const timeout = setTimeout(() => {
                              pendingRequests.delete(id);
                              reject(new Error('Request timed out'));
                        }, RESPONSE_TIMEOUT);

                        pendingRequests.set(id, { resolve, reject, timeout });
                        conn.send(message);
                  });
            },

            broadcastRequest: function <In, Out>(action: string, payload?: In): Promise<Out[]> {
                  const state = get(store);
                  if (!state.peer) throw new Error('Peer not initialized');
                  const id = crypto.randomUUID();
                  const message: P2PMessage = { type: 'request', id, action, payload };

                  // self handle request
                  const handler = requestHandlers.get(action);
                  if (handler) {
                        handler(payload, state.peer.id);
                  }

                  return Promise.allSettled(
                        state.connections.map(conn => {
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
                  handler: (payload: In, peerId: string) => Promise<Out> | Out
            ) {
                  requestHandlers.set(action, handler);
            },
      };
}();
