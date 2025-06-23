// place files you want to import through the `$lib` alias in this folder.

import { writable } from "svelte/store";

export enum TurnPhase {
      PreRoll,    // Player can trade/build/sell
      PostRoll,   // Can buy property, build, trade
      Auction,    // Auction phase
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

export type StreetField = {
      type: FieldType.Street;
      name: string;
      color: string;
      price: number;
};

export type Field =
      {
            type: FieldType.Go;
            toEarn: number;
      } | StreetField | {
            type: FieldType.CommunityChest | FieldType.Chance | FieldType.Jail | FieldType.GoToJail | FieldType.FreeParking;
      } | {
            type: FieldType.Railroad;
            name: string;
            price: number;
      } | {
            type: FieldType.Utility;
            name: string;
            price: number;
      } | {
            type: FieldType.LuxuryTax;
            toPay: number;
      } | {
            type: FieldType.IncomeTax;
            toPay: number;
      };

export const fieldTypeOrder = [
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
];

export const streetColorOrder: (keyof App.Data.Theme.Model["properties"]["streets"])[] = [
      "brown",
      "lightBlue",
      "pink",
      "orange",
      "red",
      "yellow",
      "green",
      "darkBlue",
];

export const defaultGameSettings: App.Data.Game.Settings = {
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
            totalAmount: 32
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
            totalAmount: 12
      },
      priceRailroads: [200, 200, 200, 200],
      priceUtilities: [150, 150],
      priceStreets: [
            [60, 60],
            [100, 100, 120],
            [140, 140, 160],
            [180, 180, 200],
            [220, 220, 240],
            [260, 260, 280],
            [300, 300, 320],
            [350, 400],
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

export const settings = writable<App.Data.Game.Settings>(defaultGameSettings);

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