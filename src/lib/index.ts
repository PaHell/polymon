// place files you want to import through the `$lib` alias in this folder.

export enum ChanceCardType {
      MoveTo,
      MoveBackward,
      MoveToNearestRailroad,
      MoveToNearestUtility,
      PayToBank,
      ReceiveFromBank,
      GoToJail,
      FreeJailCard,
      PayForRepairs,
      PayToOtherPlayers
}

export enum CommunityChestCardType {
      MoveToGo,
      PayToBank,
      ReceiveFromBank,
      GoToJail,
      FreeJailCard,
      PayForRepairs,
      ReceiveFixedFromOtherPlayers,
      ReceivePercentageFromOtherPlayers,
      PayToBankOrDrawChanceCard
}

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
      ownedColorSetRentMultiplier: 200,
      streets: [
            {
                  price: 60,
                  rentBase: 2,
                  rentPerHouseFixed: [10, 30, 90, 160],
                  rentPerHotelFixed: [250],
            },
            {
                  price: 60,
                  rentBase: 4,
                  rentPerHouseFixed: [20, 60, 180, 320],
                  rentPerHotelFixed: [450],
            },
            {
                  price: 100,
                  rentBase: 6,
                  rentPerHouseFixed: [30, 90, 270, 400],
                  rentPerHotelFixed: [550],
            },
            {
                  price: 100,
                  rentBase: 6,
                  rentPerHouseFixed: [30, 90, 270, 400],
                  rentPerHotelFixed: [550],
            },
            {
                  price: 120,
                  rentBase: 8,
                  rentPerHouseFixed: [40, 100, 300, 450],
                  rentPerHotelFixed: [600],
            },
            {
                  price: 140,
                  rentBase: 10,
                  rentPerHouseFixed: [50, 150, 450, 625],
                  rentPerHotelFixed: [750],
            },
            {
                  price: 140,
                  rentBase: 10,
                  rentPerHouseFixed: [50, 150, 450, 625],
                  rentPerHotelFixed: [750],
            },
            {
                  price: 160,
                  rentBase: 12,
                  rentPerHouseFixed: [60, 180, 500, 700],
                  rentPerHotelFixed: [900],
            },
            {
                  price: 180,
                  rentBase: 14,
                  rentPerHouseFixed: [70, 200, 550, 750],
                  rentPerHotelFixed: [950],
            },
            {
                  price: 180,
                  rentBase: 14,
                  rentPerHouseFixed: [70, 200, 550, 750],
                  rentPerHotelFixed: [950],
            },
            {
                  price: 200,
                  rentBase: 16,
                  rentPerHouseFixed: [80, 220, 600, 800],
                  rentPerHotelFixed: [1000],
            },
            {
                  price: 220,
                  rentBase: 18,
                  rentPerHouseFixed: [90, 250, 700, 875],
                  rentPerHotelFixed: [1100],
            },
            {
                  price: 220,
                  rentBase: 18,
                  rentPerHouseFixed: [90, 250, 700, 875],
                  rentPerHotelFixed: [1050],
            },
            {
                  price: 240,
                  rentBase: 20,
                  rentPerHouseFixed: [100, 300, 750, 925],
                  rentPerHotelFixed: [1100],
            },
            {
                  price: 260,
                  rentBase: 22,
                  rentPerHouseFixed: [110, 330, 800, 975],
                  rentPerHotelFixed: [1150],
            },
            {
                  price: 260,
                  rentBase: 22,
                  rentPerHouseFixed: [110, 330, 800, 975],
                  rentPerHotelFixed: [1150],
            },
            {
                  price: 280,
                  rentBase: 24,
                  rentPerHouseFixed: [120, 360, 850, 1025],
                  rentPerHotelFixed: [1200],
            },
            {
                  price: 300,
                  rentBase: 26,
                  rentPerHouseFixed: [130, 390, 900, 1100],
                  rentPerHotelFixed: [1275],
            },
            {
                  price: 300,
                  rentBase: 26,
                  rentPerHouseFixed: [130, 390, 900, 1100],
                  rentPerHotelFixed: [1275],
            },
            {
                  price: 320,
                  rentBase: 28,
                  rentPerHouseFixed: [150, 450, 1000, 1200],
                  rentPerHotelFixed: [1400],
            },
            {
                  price: 350,
                  rentBase: 35,
                  rentPerHouseFixed: [175, 500, 1100, 1300],
                  rentPerHotelFixed: [1500],
            },
            {
                  price: 400,
                  rentBase: 50,
                  rentPerHouseFixed: [200, 600, 1400, 1700],
                  rentPerHotelFixed: [2000],
            },
      ],
      railroads: {
            price: 200,
            rent: 25,
            multiplierPerOwned: [1, 2, 4, 8],
      },
      utilities: {
            price: 150,
            rent: 4,
            diceMultiplierPerOwned: [4, 10],
      },
      houses: {
            pricePerColorSet: [
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
            maxPerStreet: 1,
            sellPricePercentage: 50,
      },
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