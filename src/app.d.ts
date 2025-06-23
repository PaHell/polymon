// See https://svelte.dev/docs/kit/types#app.d.ts

import type { GameEventType, PlayerColor } from "$lib";
import type { TurnPhase } from "$lib/game";

// for information about these interfaces
declare global {
	namespace App {
		namespace Data {
			namespace Game {
				type Player = {
					id: string;
					seed: string;
					color: PlayerColor;
					isReady: boolean;
				}
				type Bot = {
					id: string;
					name: string;
					color: PlayerColor;
				}
				type Settings = {
					startingBalance: number;
					goSalary: number;
					incomeTax: number;
					luxuryTax: number;
					maxTurnsInJail: number;
					throwsPerTurnInJail: number;
					jailExitPrice: number;
					houses: {
						pricePerStreet: [
							number, number,
							number, number,
							number, number,
							number, number,
						];
						totalAmount: number;
					};
					hotels: {
						pricePerStreet: [
							number, number,
							number, number,
							number, number,
							number, number,
						];
						housesRequired: number;
						totalAmount: number;
					};
					priceRailroads: [number, number, number, number];
					priceUtilities: [number, number];
					priceStreets: [
						// top
						[number, number],
						[number, number, number],
						// right
						[number, number, number],
						[number, number, number],
						// bottom
						[number, number, number],
						[number, number, number],
						// left
						[number, number, number],
						[number, number],
					];
					auction: {
						startingPrice: number;
						minBidIncrement: number;
					};
					mortgage: {
						interestRatePercentage: number;
						loanPercentage: number;
					};
				}
			}
			namespace GameState {
				type GameStartResult = {
					startingPlayerId: string;
					dices: Record<App.Data.GameState.Player["id"], number>;
				}
				type Player = {
					id: string;
					seed: string;
					turnOrder: number;
					color: PlayerColor;
					balance: number;
					position: number;
					jailCards: number;
					isInJail: boolean;
					turnsInJail: number;
				}
				type Bot = Omit<Player, "seed"> & {
					name: string;
				}
				type Railroad = {
					id: string;
					isMortgaged: boolean;
					ownerId?: string;
				}
				type Utility = Railroad;
				type Street = Railroad & {
					amountOfHouses: number;
					hasHotel: boolean;
				}
				type Model = {
					turnCount: number;
					turnPhase: TurnPhase;
					currentPlayerId: string;
					outstandingTradeOffers: (Event & { type: GameEventType.TradeOffer; fromPlayerId: string; })[];
					players: Player[];
					bots: Bot[];
					railroads: Railroad[];
					utilities: Utility[];
					streets: Street[];
				}
				type Event = {
					type: GameEventType.TradeOffer;
					tradeId: string;
					toPlayerId: string;
					offeredPropertyIds: number[];
					requestedPropertyIds: number[];
					amountMoney: number;
				} | {
					type: GameEventType.TradeAccept;
					tradeId: string;
				} | {
					type: GameEventType.TradeReject;
					tradeId: string;
				} | {
					type: GameEventType.MortgageProperty;
					propertyId: string;
				} | {
					type: GameEventType.UnmortgageProperty;
					propertyId: string;
				} | {
					type: GameEventType.UseJailCard;
				} | {
					type: GameEventType.BuildHouse;
					propertyId: string;
				} | {
					type: GameEventType.SellHouse;
					propertyId: string;
				} | {
					type: GameEventType.BuildHotel;
					propertyId: string;
				} | {
					type: GameEventType.SellHotel;
					propertyId: string;
				} | {
					type: GameEventType.RollDice;
				} | {
					type: GameEventType.BuyLandedProperty;
				} | {
					type: GameEventType.StartAuction;
				} | {
					type: GameEventType.AuctionBid;
					amount: number;
				} | {
					type: GameEventType.AuctionLeave;
				} | {
					type: GameEventType.EndTurn;
				} | {
					type: GameEventType.DeclareBankruptcy;
				} | {
					type: GameEventType.DeclareWinner;
				};
			}
			namespace Theme {
				type Utility = {
					name: string;
					image: string;
					background?: string;
				}
				type Railroad = Utility;
				type CommunityChest = {
					name: string;
					imageField: string;
					imageCard: string;
					background?: string;
					styleCard: string;
				};
				type Chance = CommunityChest;
				type IncomeTax = Utility;
				type LuxuryTax = Utility;
				type Go = {
					name: string;
					salary: string;
					image: string;
					background?: string;
				};
				type GoToJail = Utility;
				type FreeParking = {
					row1: string;
					row2: string;
					image: string;
					background?: string;
				};
				type Jail = {
					name: string;
					image: string;
					background?: string;
				};
				type Property = {
					name: string;
					background?: string;
				}
				type JustVisiting = {
					row1: string;
					row2: string;
					background?: string;
				};
				type Model = {
					id: string;
					name: string;
					currency: string;
					branding: {
						name: string;
						image: string;
						slogan: string;
						style?: string;
					};
					font: {
						src: string;
						name: string;
						style: string;
					};
					colors: {
						background: string;
						board: string;
						border: string;
						text: string;
						streets: [
							string, // brown
							string, // light-blue
							string, // pink
							string, // orange
							string, // red
							string, // yellow
							string, // green
							string  // dark-blue
						];
					};
					properties: {
						utilities: [Utility, Utility];
						railroads: [Railroad, Railroad, Railroad, Railroad];
						streets: {
							brown: [Property, Property];
							lightBlue: [Property, Property, Property];
							pink: [Property, Property, Property];
							orange: [Property, Property, Property];
							red: [Property, Property, Property];
							yellow: [Property, Property, Property];
							green: [Property, Property, Property];
							darkBlue: [Property, Property];
						};
						communityChest: CommunityChest;
						chance: Chance;
						incomeTax: IncomeTax;
						luxuryTax: LuxuryTax;
						go: Go;
						goToJail: GoToJail;
						freeParking: FreeParking;
						jail: Jail;
						justVisiting: JustVisiting;
					};
					// interface Error {}
					// interface Locals {}
					// interface PageData {}
					// interface PageState {}
					// interface Platform {}
				}
			}
		}
	}
}
export { };
