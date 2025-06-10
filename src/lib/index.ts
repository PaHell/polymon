// place files you want to import through the `$lib` alias in this folder.

export enum FieldType {
      Go,
      Street,
      CommunityChest,
      IncomeTax,
      Railroad,
      Chance,
      Jail,
      Utility,
      FreeParking,
      GoToJail,
      LuxuryTax,
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
            toPayFixed: number;
            toPayPercentage: number;
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

export const streetColorOrder: (keyof App.Data.Theme["properties"]["streets"])[] = [
      "brown",
      "lightBlue",
      "pink",
      "orange",
      "red",
      "yellow",
      "green",
      "darkBlue",
];

export const pricesByIndex: Record<number, number> = {
      1: 60, 3: 60,
      6: 100, 8: 100, 9: 120,
      11: 140, 13: 140, 14: 160,
      16: 180, 18: 180, 19: 200,
      21: 220, 23: 220, 24: 240,
      26: 260, 27: 260, 29: 280,
      31: 300, 32: 300, 34: 320,
      37: 350, 39: 400,
      5: 200, 15: 200, 25: 200, 35: 200,  // Stations
      12: 150, 28: 150,                  // Utilities
};

export const payIncomeTaxFixed = 200;
export const payIncomeTaxPercentage = 0.1;
export const payLuxuryTax = 100;
export const earnGo = 200;

export const botNames: App.Data.Bot["name"][] = [
      "Charles Ponzi",
      "Bernie Madoff",
      "Victor Lustig",
      "Allen Stanford",
      "Elizabeth Holmes",
      "Sam Bankman-Fried",
      "Ruja Ignatova",
      "Satish Kumbhani",
      "Jan Marsalek",
];

export const figures: App.Data.Figure[] = [
      {
            id: "1",
            name: "Plane",
            value: "flight-takeoff-line",
            isUrl: false
      },
      {
            id: "2",
            name: "Boat",
            value: "ship-2-line",
            isUrl: false
      },
      {
            id: "3",
            name: "Truck",
            value: "truck-line",
            isUrl: false
      },
      {
            id: "4",
            name: "Shopping Cart",
            value: "shopping-cart-line",
            isUrl: false
      },
      {
            id: "5",
            name: "Bike",
            value: "bike-line",
            isUrl: false
      },
      {
            id: "6",
            name: "Human",
            value: "run-line",
            isUrl: false
      },
];