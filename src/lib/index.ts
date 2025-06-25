// place files you want to import through the `$lib` alias in this folder.

export enum FieldType {
      Go = "go",
      Street = "street",
      CommunityChest = "community-chest",
      IncomeTax = "income-tax",
      Railroad = "railroad",
      Chance = "chance",
      Jail = "jail",
      Utility = "utility",
      FreeParking = "free-parking",
      GoToJail = "go-to-jail",
      LuxuryTax = "luxury-tax",
}

export const boardConfigs: App.Data.Game.BoardConfig[] = [
      {
            id: "default",
            name: "Classic",
            lengthX: 10,
            streetLengths: [
                  2, // brown
                  3, // lightBlue
                  3, // pink
                  3, // orange
                  3, // red
                  3, // yellow
                  3, // green
                  2, // darkBlue
            ],
            fieldTypeOrder: [
                  FieldType.Go,
                  FieldType.Street,
                  FieldType.CommunityChest,
                  FieldType.Street,
                  FieldType.IncomeTax,
                  FieldType.Railroad,
                  FieldType.Street,
                  FieldType.Chance,
                  FieldType.Street,
                  FieldType.Street,

                  FieldType.Jail,
                  FieldType.Street,
                  FieldType.Utility,
                  FieldType.Street,
                  FieldType.Street,
                  FieldType.Railroad,
                  FieldType.Street,
                  FieldType.CommunityChest,
                  FieldType.Street,
                  FieldType.Street,

                  FieldType.FreeParking,
                  FieldType.Street,
                  FieldType.Chance,
                  FieldType.Street,
                  FieldType.Street,
                  FieldType.Railroad,
                  FieldType.Street,
                  FieldType.Street,
                  FieldType.Utility,
                  FieldType.Street,

                  FieldType.GoToJail,
                  FieldType.Street,
                  FieldType.Street,
                  FieldType.CommunityChest,
                  FieldType.Street,
                  FieldType.Railroad,
                  FieldType.Chance,
                  FieldType.Street,
                  FieldType.LuxuryTax,
                  FieldType.Street,
            ]
      }];

export enum TurnPhase {
      PreRoll,    // Player can trade/build/sell
      PostRoll,   // Can buy property, build, trade
      Auction,    // Auction phase
}

export enum GameEventType {
      // PreRoll
      TradeOffer,
      TradeAccept,
      TradeReject,
      MortgageProperty,
      UnmortgageProperty,
      UseJailCard,
      BuildHouse,
      SellHouse,
      BuildHotel,
      SellHotel,
      // DiceRolled
      RollDice,
      // PostMove (+ everything from PreRoll)
      BuyLandedProperty,
      StartAuction,
      // Auction
      AuctionBid,
      AuctionLeave,
      // EndTurn
      EndTurn,
      DeclareBankruptcy,
      DeclareWinner,
}

export const fieldTypeClassMap: Record<FieldType, string> = {
      [FieldType.Go]: "go",
      [FieldType.Street]: "street",
      [FieldType.CommunityChest]: "community-chest",
      [FieldType.IncomeTax]: "income-tax",
      [FieldType.Railroad]: "railroad",
      [FieldType.Chance]: "chance",
      [FieldType.Jail]: "jail",
      [FieldType.Utility]: "utility",
      [FieldType.FreeParking]: "free-parking",
      [FieldType.GoToJail]: "go-to-jail",
      [FieldType.LuxuryTax]: "luxury-tax",
};

export function getStreetIndex(board: App.Data.Game.BoardConfig, streetId: App.Data.GameState.Street["id"]): number {
      const index = Number(streetId.split("-")[1]);
      let count = 0;

      for (let i = 0; i < board.streetLengths.length; i++) {
            count += board.streetLengths[i];
            if (index < count) {
                  return i;
            }
      }
      return -1;
}

export function getSideIndex(board: App.Data.Game.BoardConfig, index: number): number {
      const lengthX = board.lengthX;
      const lengthY = (board.fieldTypeOrder.length - 2 * lengthX) / 2;
      return index < lengthX
            ? 0
            : index < lengthX + lengthY
                  ? 1
                  : index < 2 * lengthX + lengthY
                        ? 2
                        : 3;
}

export function getFieldIndexOnSide(board: App.Data.Game.BoardConfig, index: number): number {
      const lengthX = board.lengthX;
      const lengthY = (board.fieldTypeOrder.length - 2 * lengthX) / 2;
      if (index < lengthX) {
            return index; // Top side
      } else if (index < lengthX + lengthY) {
            return index - lengthX; // Right side
      } else if (index < (2 * lengthX) + lengthY) {
            return index - lengthX - lengthY; // Bottom side
      } else {
            return index - (2 * lengthX) - lengthY; // Left side
      }
}

export const defaultGameSettings: App.Data.Game.Settings = {
      boardId: "default",
      startingBalance: 1500,
      goSalary: 200,
      incomeTax: 200,
      luxuryTax: 100,
      maxTurnsInJail: 3,
      throwsPerTurnInJail: 3,
      jailExitPrice: 50,
      houses: {
            pricePerStreet: [
                  50, // brown
                  50, // lightBlue
                  100, // pink
                  100, // orange
                  150, // red
                  150, // yellow
                  200, // green
                  200, // darkBlue
            ],
            totalAmount: 32,
            sellPricePercentage: 50,
      },
      hotels: {
            pricePerStreet: [
                  50, // brown
                  50, // lightBlue
                  100, // pink
                  100, // orange
                  150, // red
                  150, // yellow
                  200, // green
                  200, // darkBlue
            ],
            housesRequired: 4,
            totalAmount: 12,
            sellPricePercentage: 50,
      },
      priceRailroads: [200, 200, 200, 200],
      priceUtilities: [150, 150],
      priceStreets: [
            60, 60,
            100, 100, 120,
            140, 140, 160,
            180, 180, 200,
            220, 220, 240,
            260, 260, 280,
            300, 300, 320,
            350, 400,
      ],
      auction: {
            startingPrice: 50,
            minBidIncrement: 10
      },
      mortgage: {
            interestRatePercentage: 10,
            loanPercentage: 50
      }
}

export const botNames: App.Data.Game.Bot["name"][] = [
      "Charles Ponzi",
      "Bernie Madoff",
      "Victor Lustig",
      "Allen Stanford",
      "Donald Trump",
      "Elizabeth Holmes",
      "Sam Bankman-Fried",
      "Ruja Ignatova",
      "Satish Kumbhani",
      "Jan Marsalek",
];

export enum PlayerColor {
      Red,
      Blue,
      Green,
      Yellow,
      Orange,
      Purple,
      Brown,
      Pink,
      Gray
}

export const colors: Record<PlayerColor, string> = {
      [PlayerColor.Red]: "#FF0000",
      [PlayerColor.Blue]: "#0000FF",
      [PlayerColor.Green]: "#00FF00",
      [PlayerColor.Yellow]: "#FFFF00",
      [PlayerColor.Orange]: "#FFA500",
      [PlayerColor.Purple]: "#800080",
      [PlayerColor.Brown]: "#A52A2A",
      [PlayerColor.Pink]: "#FFC0CB",
      [PlayerColor.Gray]: "#808080",
}