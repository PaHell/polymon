import { boardConfigs, defaultGameSettings, FieldType, GameEventType, TurnPhase } from "$lib";
import { get, writable } from "svelte/store";

async function sha256Hash(str: string): Promise<string> {
      const encoder = new TextEncoder();
      const data = encoder.encode(str);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function getHash(state: App.Data.GameState.Model): Promise<string> {
      if (!state) return "";
      return await sha256Hash(stringifyGameState(state));
}

function stringifyGameState(obj: App.Data.GameState.Model): string {
      return obj.turnCount + "|" +
            obj.turnPhase + "|" +
            obj.currentPlayerId + "|" +
            obj.outstandingTradeOffers.map(tradeOffer =>
                  tradeOffer.tradeId + "," +
                  tradeOffer.fromPlayerId + "," +
                  tradeOffer.toPlayerId + "," +
                  tradeOffer.amountMoney + "," +
                  tradeOffer.offeredPropertyIds.join("/") + "," +
                  tradeOffer.requestedPropertyIds.join("/")
            ).join(";") + "|" +
            obj.players.map(player =>
                  player.id + "," +
                  player.color + "," +
                  player.balance + "," +
                  player.position + "," +
                  player.jailCards + "," +
                  player.isInJail + "," +
                  player.turnsInJail
            ).join(";") + "|" +
            obj.bots.map(bot =>
                  bot.id + "," +
                  bot.color + "," +
                  bot.name + "," +
                  bot.balance + "," +
                  bot.position + "," +
                  bot.jailCards + "," +
                  bot.isInJail + "," +
                  bot.turnsInJail
            ).join(";") + "|" +
            obj.railroads.map(rr =>
                  rr.id + "," +
                  rr.isMortgaged + "," +
                  rr.ownerId
            ).join(";") + "|" +
            obj.utilities.map(util =>
                  util.id + "," +
                  util.isMortgaged + "," +
                  util.ownerId
            ).join(";") + "|" +
            obj.streets.map(street =>
                  street.id + "," +
                  street.isMortgaged + "," +
                  street.ownerId + "," +
                  street.amountOfHouses + "," +
                  street.hasHotel
            ).join(";");
}

function getDicesFromHash(hash: string, amount: number): number[] {
      if (amount <= 0) return [];

      const partLength = Math.floor(hash.length / amount);
      const dices: number[] = [];

      for (let i = 0; i < amount; i++) {
            const part = hash.slice(i * partLength, (i + 1) * partLength);
            const bytes = new Uint8Array(part.match(/.{1,2}/g)?.map(b => parseInt(b, 16)) ?? []);
            const sum = bytes.reduce((acc, b) => acc + b, 0);
            dices.push((sum % 6) + 1);
      }

      return dices;
}

function getLegalMoves(state: App.Data.GameState.Model): GameEventType[] {
      switch (state.turnPhase) {
            case TurnPhase.PreRoll:
                  return [
                        GameEventType.BuildHouse,
                        GameEventType.BuildHotel,
                        GameEventType.SellHouse,
                        GameEventType.SellHotel,
                        GameEventType.TradeOffer,
                        GameEventType.TradeAccept,
                        GameEventType.TradeReject,
                        GameEventType.MortgageProperty,
                        GameEventType.UnmortgageProperty,
                        GameEventType.UseJailCard,
                        GameEventType.RollDice
                  ];
            case TurnPhase.PostRoll:
                  return [
                        GameEventType.BuildHouse,
                        GameEventType.BuildHotel,
                        GameEventType.SellHouse,
                        GameEventType.SellHotel,
                        GameEventType.TradeOffer,
                        GameEventType.TradeAccept,
                        GameEventType.TradeReject,
                        GameEventType.MortgageProperty,
                        GameEventType.UnmortgageProperty,
                        GameEventType.BuyLandedProperty,
                        GameEventType.StartAuction,
                        GameEventType.EndTurn,
                        GameEventType.DeclareBankruptcy,
                        GameEventType.DeclareWinner,
                  ];
            case TurnPhase.Auction:
                  return [
                        GameEventType.AuctionBid,
                        GameEventType.AuctionLeave
                  ];
            default:
                  return [];
      }
}

function isPlayerAtTurn(state: App.Data.GameState.Model, playerId: App.Data.GameState.Player["id"]): boolean {
      return state.currentPlayerId === playerId;
}

function getPropertyOwner(state: App.Data.GameState.Model, propertyId: App.Data.GameState.Railroad["id"]): App.Data.GameState.Player["id"] | null {
      const street = state.streets.find(s => s.id === propertyId);
      if (street && street.ownerId) return street.ownerId;
      const railroad = state.railroads.find(r => r.id === propertyId);
      if (railroad && railroad.ownerId) return railroad.ownerId;
      const utility = state.utilities.find(u => u.id === propertyId);
      if (utility && utility.ownerId) return utility.ownerId;
      return null;
}

export function getFieldTypeIndex(board: App.Data.Game.BoardConfig, fieldType: FieldType, position: number): number {
      let fieldIndex = -1;
      for (let i = 0; i <= position; i++) {
            if (board.fieldTypeOrder[i] === fieldType) {
                  fieldIndex++;
            }
      }
      return fieldIndex;
}

function getFieldPrice(settings: App.Data.Game.Settings, fieldType: FieldType, fieldIndex: number): number {
      switch (fieldType) {
            case FieldType.Street:
                  return settings.priceStreets.flatMap(s => s)[fieldIndex];
            case FieldType.Railroad:
                  return settings.priceRailroads[fieldIndex];
            case FieldType.Utility:
                  return settings.priceUtilities[fieldIndex];
            default:
                  return 0;
      }
}

function setPlayerBalance(state: App.Data.GameState.Model, playerId: App.Data.GameState.Player["id"], amount: number): App.Data.GameState.Model {
      return {
            ...state,
            players: state.players.map(player => {
                  if (player.id !== playerId) return player;
                  return {
                        ...player,
                        balance: player.balance + amount,
                  };
            }),
      };
}

function setPropertyOwner(state: App.Data.GameState.Model, propertyId: App.Data.GameState.Railroad["id"], playerId: App.Data.GameState.Player["id"]): App.Data.GameState.Model {
      const existingOwnership = [...state.streets, ...state.railroads, ...state.utilities].find(s => s.id === propertyId);
      if (existingOwnership) {
            existingOwnership.ownerId = playerId;
            return state;
      }
      const type = propertyId.split("-")[0] as FieldType;
      switch (type) {
            case FieldType.Street:
                  state.streets.push({
                        id: propertyId,
                        isMortgaged: false,
                        ownerId: playerId,
                        amountOfHouses: 0,
                        hasHotel: false,
                  });
                  break;
            case FieldType.Railroad:
                  state.railroads.push({
                        id: propertyId,
                        isMortgaged: false,
                        ownerId: playerId,
                  });
                  break;
            case FieldType.Utility:
                  state.utilities.push({
                        id: propertyId,
                        isMortgaged: false,
                        ownerId: playerId,
                  });
                  break;
      }
      return state;
}

export const engine = function () {
      const store = writable<App.Data.GameState.Model>();
      let settings = defaultGameSettings;
      let board = boardConfigs[0];
      return {
            subscribe: store.subscribe,
            settings,
            board,
            initialize: async (players: App.Data.Game.Player[], bots: App.Data.Game.Bot[], _settings: App.Data.Game.Settings): Promise<App.Data.GameState.GameStartResult> => {
                  settings = _settings;
                  board = boardConfigs.find(b => b.id === _settings.boardId) || boardConfigs[0];
                  const hash = await sha256Hash(players.map(i => i.seed).join(","));
                  const playerDices = getDicesFromHash(hash, players.length + bots.length).reduce((acc, dice, index) => {
                        const playerId = index < players.length ? players[index].id : bots[index - players.length].id;
                        acc[playerId] = dice;
                        return acc;
                  }, {} as Record<App.Data.GameState.Player["id"], number>);
                  const state: App.Data.GameState.Model = {
                        turnCount: 0,
                        turnPhase: TurnPhase.PreRoll,
                        currentPlayerId: players.length > 0 ? players[0].id : "",
                        outstandingTradeOffers: [],
                        players: players.map(player => ({
                              id: player.id,
                              seed: player.seed,
                              turnOrder: -1,
                              color: player.color,
                              balance: _settings.startingBalance,
                              position: 0,
                              jailCards: 0,
                              isInJail: false,
                              turnsInJail: 0,
                        })),
                        bots: bots.map(bot => ({
                              id: bot.id,
                              turnOrder: -1,
                              color: bot.color,
                              name: bot.name,
                              balance: _settings.startingBalance,
                              position: 0,
                              jailCards: 0,
                              isInJail: false,
                              turnsInJail: 0,
                        })),
                        railroads: [],
                        utilities: [],
                        streets: [],
                  };
                  const turnOrder = Object.entries(playerDices).sort((a, b) => b[1] - a[1]).map(i => i[0]);
                  const result: App.Data.GameState.GameStartResult = {
                        startingPlayerId: turnOrder[0][0],
                        dices: playerDices,
                  };
                  state.players.forEach((player) => {
                        player.turnOrder = turnOrder.indexOf(player.id);
                  });
                  state.bots.forEach((bot) => {
                        bot.turnOrder = turnOrder.indexOf(bot.id);
                  });
                  if (state.players.find(p => p.turnOrder === -1)) throw new Error("Not all players have a turn order assigned.");
                  state.currentPlayerId = turnOrder[0];
                  state.turnCount = 1;
                  state.turnPhase = TurnPhase.PreRoll;
                  store.set(state);
                  return result;
            },
            getLegalMoves,
            rollDice: async (playerId: App.Data.GameState.Player["id"]): Promise<[number, number] | void> => {
                  const state = get(store);
                  if (!isPlayerAtTurn(state, playerId)) return;
                  if (!getLegalMoves(state).includes(GameEventType.RollDice)) return;
                  const hash = await getHash(state);
                  const [dice1, dice2] = getDicesFromHash(hash, 2);
                  store.update(currentState => {
                        if (!currentState) return currentState;
                        return {
                              ...currentState,
                              players: currentState.players.map(player => {
                                    if (player.id !== playerId) return player;
                                    return {
                                          ...player,
                                          position: (player.position + dice1 + dice2) % board.fieldTypeOrder.length,
                                    }
                              }),
                              turnPhase: TurnPhase.PostRoll,
                        };
                  });
                  return [dice1, dice2];
            },
            buyLandedProperty: (playerId: App.Data.GameState.Player["id"]): boolean => {
                  const state = get(store);
                  console.log("Buy Landed Property for player:", playerId);
                  if (!isPlayerAtTurn(state, playerId)) return false;
                  if (!getLegalMoves(state).includes(GameEventType.BuyLandedProperty)) return false;
                  console.log("Checking if player can buy landed property");
                  const player = state.players.find(p => p.id === playerId)!;
                  const fieldType = board.fieldTypeOrder[player.position];
                  const fieldIndex = getFieldTypeIndex(board, fieldType, player.position);
                  console.log("Field Type:", fieldType, "Field Index:", fieldIndex);
                  if (fieldIndex === -1) return false;
                  if ([FieldType.Street, FieldType.Railroad, FieldType.Utility].indexOf(fieldType) === -1) {
                        console.log("Field is not purchasable:", fieldType);
                        return false;
                  }
                  const propertyId = fieldType + ("-" + fieldIndex);
                  const owner = getPropertyOwner(state, propertyId);
                  if (owner) return false;
                  console.log("Checking if property is purchasable");
                  const price = getFieldPrice(settings, fieldType, fieldIndex);
                  if (player.balance < price) return false;
                  console.log("Player can buy property:", propertyId, "for price:", price);
                  store.update(currentState => {
                        if (!currentState) return currentState;
                        currentState = setPlayerBalance(currentState, playerId, -price);
                        currentState = setPropertyOwner(currentState, propertyId, playerId);
                        return currentState;
                  });
                  return true;
            },
            startAuction: (playerId: App.Data.GameState.Player["id"]): boolean => {
                  const state = get(store);
                  if (!isPlayerAtTurn(state, playerId)) return false;
                  if (!getLegalMoves(state).includes(GameEventType.StartAuction)) return false;
                  const player = state.players.find(p => p.id === playerId)!;
                  const fieldType = board.fieldTypeOrder[player.position];
                  const fieldIndex = getFieldTypeIndex(board, fieldType, player.position);
                  if (fieldIndex === -1) return false;
                  const propertyId = fieldType + ("-" + fieldIndex);
                  const propertyOwner = getPropertyOwner(state, propertyId);
                  if (propertyOwner) return false;
                  store.update(currentState => {
                        if (!currentState) return currentState;
                        currentState.turnPhase = TurnPhase.Auction;
                        return currentState;
                  });
                  return true;
            },
            buyHouseForProperty: (playerId: App.Data.GameState.Player["id"], propertyId: App.Data.GameState.Railroad["id"]): boolean => {
                  const state = get(store);
                  if (!isPlayerAtTurn(state, playerId)) return false;
                  if (!getLegalMoves(state).includes(GameEventType.BuildHouse)) return false;
                  const player = state.players.find(p => p.id === playerId)!;
                  const propertyOwner = getPropertyOwner(state, propertyId);
                  if (propertyOwner !== playerId) return false;
                  const street = state.streets.find(s => s.id === propertyId);
                  if (!street || street.hasHotel || street.amountOfHouses >= settings.hotels.housesRequired) return false;
                  const fieldTypeIndex = getFieldTypeIndex(board, FieldType.Street, Number(street.id.split("-")[1]));
                  const price = settings.priceStreets.flatMap(s => s)[fieldTypeIndex];
                  if (player.balance < price) return false;
                  store.update(currentState => {
                        if (!currentState) return currentState;
                        currentState = setPlayerBalance(currentState, playerId, -price);
                        currentState.streets.find(s => s.id === propertyId)!.amountOfHouses += 1;
                        return currentState;
                  });
                  return true;
            },
            buyHotelForProperty: (playerId: App.Data.GameState.Player["id"], propertyId: App.Data.GameState.Railroad["id"]): boolean => {
                  const state = get(store);
                  if (!isPlayerAtTurn(state, playerId)) return false;
                  if (!getLegalMoves(state).includes(GameEventType.BuildHotel)) return false;
                  const player = state.players.find(p => p.id === playerId)!;
                  const propertyOwner = getPropertyOwner(state, propertyId);
                  if (propertyOwner !== playerId) return false;
                  const street = state.streets.find(s => s.id === propertyId);
                  if (!street || street.hasHotel || street.amountOfHouses !== settings.hotels.housesRequired) return false;
                  const fieldTypeIndex = getFieldTypeIndex(board, FieldType.Street, Number(street.id.split("-")[1]));
                  const price = settings.hotels.pricePerStreet.flatMap(s => s)[fieldTypeIndex];
                  if (player.balance < price) return false;
                  store.update(currentState => {
                        if (!currentState) return currentState;
                        currentState = setPlayerBalance(currentState, playerId, -price);
                        currentState.streets.find(s => s.id === propertyId)!.hasHotel = true;
                        currentState.streets.find(s => s.id === propertyId)!.amountOfHouses = 0;
                        return currentState;
                  });
                  return true;
            },
            sellHouseForProperty: (playerId: App.Data.GameState.Player["id"], propertyId: App.Data.GameState.Railroad["id"]): boolean => {
                  const state = get(store);
                  if (!isPlayerAtTurn(state, playerId)) return false;
                  if (!getLegalMoves(state).includes(GameEventType.SellHouse)) return false;
                  const propertyOwner = getPropertyOwner(state, propertyId);
                  if (propertyOwner !== playerId) return false;
                  const street = state.streets.find(s => s.id === propertyId);
                  if (!street || street.amountOfHouses <= 0) return false;
                  const fieldTypeIndex = getFieldTypeIndex(board, FieldType.Street, Number(street.id.split("-")[1]));
                  const price = settings.priceStreets.flatMap(s => s)[fieldTypeIndex] / 2;
                  store.update(currentState => {
                        if (!currentState) return currentState;
                        currentState = setPlayerBalance(currentState, playerId, price);
                        currentState.streets.find(s => s.id === propertyId)!.amountOfHouses -= 1;
                        return currentState;
                  });
                  return true;
            },
            sellHotelForProperty: (playerId: App.Data.GameState.Player["id"], propertyId: App.Data.GameState.Railroad["id"]): boolean => {
                  const state = get(store);
                  if (!isPlayerAtTurn(state, playerId)) return false;
                  if (!getLegalMoves(state).includes(GameEventType.SellHotel)) return false;
                  const propertyOwner = getPropertyOwner(state, propertyId);
                  if (propertyOwner !== playerId) return false;
                  const street = state.streets.find(s => s.id === propertyId);
                  if (!street || !street.hasHotel) return false;
                  const fieldTypeIndex = getFieldTypeIndex(board, FieldType.Street, Number(street.id.split("-")[1]));
                  const price = settings.hotels.pricePerStreet.flatMap(s => s)[fieldTypeIndex] / 2;
                  store.update(currentState => {
                        if (!currentState) return currentState;
                        currentState = setPlayerBalance(currentState, playerId, price);
                        currentState.streets.find(s => s.id === propertyId)!.hasHotel = false;
                        currentState.streets.find(s => s.id === propertyId)!.amountOfHouses = settings.hotels.housesRequired;
                        return currentState;
                  });
                  return true;
            },
            mortgageProperty: (playerId: App.Data.GameState.Player["id"], propertyId: App.Data.GameState.Railroad["id"]): number => {
                  const state = get(store);
                  if (!isPlayerAtTurn(state, playerId)) return 0;
                  if (!getLegalMoves(state).includes(GameEventType.MortgageProperty)) return 0;
                  const propertyOwner = getPropertyOwner(state, propertyId);
                  if (propertyOwner !== playerId) return 0;
                  const property = [...state.streets, ...state.railroads, ...state.utilities].find(s => s.id === propertyId);
                  if (!property || property.isMortgaged) return 0;
                  const fieldTypeIndex = getFieldTypeIndex(board, property.id.split("-")[0] as FieldType, Number(property.id.split("-")[1]));
                  const loan = Math.round((getFieldPrice(settings, property.id.split("-")[0] as FieldType, fieldTypeIndex) * settings.mortgage.loanPercentage) / 100);
                  store.update(currentState => {
                        if (!currentState) return currentState;
                        currentState = setPlayerBalance(currentState, playerId, loan);
                        const prop = currentState.streets.find(s => s.id === propertyId)
                              || currentState.railroads.find(r => r.id === propertyId)
                              || currentState.utilities.find(u => u.id === propertyId);
                        if (prop) prop.isMortgaged = true;
                        return currentState;
                  });
                  return loan;
            },
            unmortgageProperty: (playerId: App.Data.GameState.Player["id"], propertyId: App.Data.GameState.Railroad["id"]): boolean => {
                  const state = get(store);
                  if (!isPlayerAtTurn(state, playerId)) return false;
                  if (!getLegalMoves(state).includes(GameEventType.UnmortgageProperty)) return false;
                  const propertyOwner = getPropertyOwner(state, propertyId);
                  if (propertyOwner !== playerId) return false;
                  const property = [...state.streets, ...state.railroads, ...state.utilities].find(s => s.id === propertyId);
                  if (!property || !property.isMortgaged) return false;
                  const fieldTypeIndex = getFieldTypeIndex(board, property.id.split("-")[0] as FieldType, Number(property.id.split("-")[1]));
                  const loan = Math.round((getFieldPrice(settings, property.id.split("-")[0] as FieldType, fieldTypeIndex) * settings.mortgage.loanPercentage) / 100);
                  const interest = Math.round((loan * settings.mortgage.interestRatePercentage) / 100);
                  const totalPayment = loan + interest;
                  if (state.players.find(p => p.id === playerId)!.balance < totalPayment) return false;
                  store.update(currentState => {
                        if (!currentState) return currentState;
                        currentState = setPlayerBalance(currentState, playerId, -totalPayment);
                        const prop = currentState.streets.find(s => s.id === propertyId)
                              || currentState.railroads.find(r => r.id === propertyId)
                              || currentState.utilities.find(u => u.id === propertyId);
                        if (prop) prop.isMortgaged = false;
                        return currentState;
                  });
                  return true;
            },
            useJailCard: (playerId: App.Data.GameState.Player["id"]): boolean => {
                  const state = get(store);
                  if (!isPlayerAtTurn(state, playerId)) return false;
                  if (!getLegalMoves(state).includes(GameEventType.UseJailCard)) return false;
                  const player = state.players.find(p => p.id === playerId);
                  if (!player || player.jailCards <= 0 || !player.isInJail) return false;
                  store.update(currentState => {
                        if (!currentState) return currentState;
                        currentState.players.find(p => p.id === playerId)!.isInJail = false;
                        currentState.players.find(p => p.id === playerId)!.jailCards -= 1;
                        return currentState;
                  });
                  return true;
            },
            endTurn: (playerId: App.Data.GameState.Player["id"]): boolean => {
                  const state = get(store);
                  console.log("End Turn for player:", playerId);
                  if (!isPlayerAtTurn(state, playerId)) return false;
                  if (!getLegalMoves(state).includes(GameEventType.EndTurn)) return false;
                  console.log("Ending turn");
                  store.update(currentState => {
                        if (!currentState) return currentState;
                        currentState.turnCount += 1;
                        currentState.turnPhase = TurnPhase.PreRoll;
                        const players = [...currentState.players, ...currentState.bots];
                        const playerOrder = players.sort((a, b) => a.turnOrder - b.turnOrder);
                        const currentPlayerIndex = playerOrder.findIndex(p => p.id === playerId);
                        console.log("Current player index:", currentPlayerIndex);
                        const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
                        console.log("Next player index:", nextPlayerIndex);
                        currentState.currentPlayerId = playerOrder[nextPlayerIndex].id;
                        console.log("Next player:", currentState.currentPlayerId);
                        return currentState;
                  });
                  return true;
            }
      }
}();