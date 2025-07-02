// See https://svelte.dev/docs/kit/types#app.d.ts

import type { FieldType, GameEventType, PlayerColor } from "$lib";
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
				type BoardConfig = {
					id: string;
					name: string;
					lengthX: number;
					streetLengths: number[];
					fieldTypeOrder: FieldType[];
				};
				type Settings = {
					boardId: string;
					startingBalance: number;
					goSalary: number;
					incomeTax: number;
					luxuryTax: number;
					maxTurnsInJail: number;
					throwsPerTurnInJail: number;
					jailExitPrice: number;
					ownedColorSetRentMultiplier: number;
					streets: {
						price: number;
						rentBase: number;
						rentPerHouseFixed: number[];
						rentPerHotelFixed: number[];
					}[];
					railroads: {
						price: number;
						rent: number;
						multiplierPerOwned: number[];
					};
					utilities: {
						price: number;
						rent: number;
						diceMultiplierPerOwned: number[];
					};
					houses: {
						pricePerColorSet: number[];
						totalAmount: number;
						sellPricePercentage: number;
					};
					hotels: {
						pricePerStreet: number[];
						housesRequired: number;
						totalAmount: number;
						sellPricePercentage: number;
						maxPerStreet: number;
					};
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
				type Street = {
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
						utilities: Utility[];
						railroads: Railroad[];
						streets: Street[];
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
