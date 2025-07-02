import { FieldType } from "$lib";
import { writable } from "svelte/store";

export function getThemePropertiesKey(
      type: FieldType,
): keyof App.Data.Theme.Model['properties'] & ("streets" | "railroads" | "utilities") {
      switch (type) {
            case FieldType.Street:
                  return 'streets';
            case FieldType.Railroad:
                  return 'railroads';
            case FieldType.Utility:
                  return 'utilities';
      }
      return "utilities";
}

export const themes: App.Data.Theme.Model[] = [
      {
            id: "default",
            name: "Default",
            currency: "$",
            branding: {
                  name: "Monopoly",
                  image: "/themes/default/branding.png",
                  slogan: "◈ The Fast-Dealing Property Trading Game ◈",
                  style: "border: 0.25rem solid #0c0e00; padding: 0.625rem 1.25rem; background-color: red; box-shadow: inset 0 8px 12px -4px rgba(255, 255, 255, .5), inset 0 -8px 12px -4px rgba(0, 0, 0, .5); margin-bottom: 0.5rem; color: white; text-shadow: -2px 2px 0 black, -1px 1px 0 black, 2px -2px 0 lightgray, 1px -1px 0 lightgray;"
            },
            font: {
                  src: "",
                  name: "",
                  style: ""
            },
            colors: {
                  background: "#cce3c7",
                  board: "#cce3c7",
                  border: "#0c0e00",
                  text: "#000000",
                  streets: [
                        "#b5651d", // brown
                        "#add8e6", // light-blue
                        "#ff69b4", // pink
                        "#ffa500", // orange
                        "#ff0000", // red
                        "#ffff00", // yellow
                        "#008000", // green
                        "#00008b", // dark-blue
                  ],
            },
            properties: {
                  utilities: [
                        { name: "Electric Company", image: "/themes/default/electric-company.svg", background: "" },
                        { name: "Water Works", image: "/themes/default/waterworks.svg", background: "" }
                  ],
                  railroads: [
                        { name: "Kings Cross Station", image: "/themes/default/railroad.svg", background: "" },
                        { name: "Marylebone Station", image: "/themes/default/railroad.svg", background: "" },
                        { name: "Fenchurch St. Station", image: "/themes/default/railroad.svg", background: "" },
                        { name: "Liverpool St. Station", image: "/themes/default/railroad.svg", background: "" }
                  ],
                  streets: [
                        { name: "Old Kent Road", background: "" },
                        { name: "Whitechapel Road", background: "" },
                        { name: "The Angel, Islington", background: "" },
                        { name: "Euston Road", background: "" },
                        { name: "Pentonville Road", background: "" },
                        { name: "Pall Mall", background: "" },
                        { name: "Whitehall", background: "" },
                        { name: "Northumbrlnd Avenue", background: "" },
                        { name: "Bow Street", background: "" },
                        { name: "Marlborough Street", background: "" },
                        { name: "Vine Street", background: "" },
                        { name: "Strand", background: "" },
                        { name: "Fleet Street", background: "" },
                        { name: "Trafalgar Square", background: "" },
                        { name: "Leicester Square", background: "" },
                        { name: "Coventry Street", background: "" },
                        { name: "Piccadilly", background: "" },
                        { name: "Regent Street", background: "" },
                        { name: "Oxford Street", background: "" },
                        { name: "Bond Street", background: "" },
                        { name: "Park Lane", background: "" },
                        { name: "Mayfair", background: "" }
                  ],
                  communityChest: {
                        name: "Community Chest",
                        imageField: "/themes/default/community-chest-field.svg",
                        imageCard: "/themes/default/community-chest-card.svg",
                        background: "",
                        styleCard: "background-color: #9DD9EC; background: linear-gradient(135deg, #61b3ff 0%, #74c0ff 50%, #61b3ff 100%);"
                  },
                  chance: {
                        name: "Chance",
                        imageField: "/themes/default/chance-field.svg",
                        imageCard: "/themes/default/chance-card.svg",
                        background: "",
                        styleCard: "background-color: #BB4E9C; background: linear-gradient(135deg, #f49827 0%, #f9a93d 50%, #f49827 100%);"
                  },
                  incomeTax: { name: "Income Tax", image: "/themes/default/electric-company.svg", background: "" },
                  luxuryTax: { name: "Luxury Tax", image: "/themes/default/electric-company.svg", background: "" },
                  go: { name: "Go", salary: "Salary", image: "/themes/default/go.svg", background: "" },
                  goToJail: { name: "Go To", image: "/themes/default/go-to-jail.svg", background: "" },
                  freeParking: { row1: "Free", row2: "Parking", image: "/themes/default/free-parking.svg", background: "" },
                  jail: { name: "In Jail", image: "/themes/default/jail.svg", background: "" },
                  justVisiting: { row1: "Just", row2: "Visting", background: "" }
            }
      },
      {
            id: "signa-bust",
            name: "Signa Bust",
            currency: "€",
            branding: {
                  image: "/themes/default/branding.png",
                  name: "SIGNA",
                  slogan: "◆ Build Empires. Watch Them Crumble. ◆",
                  style: "border: 0.25rem solid gold; padding: 0.625rem 1.25rem; background: linear-gradient(to right, #003366, #8b0000); box-shadow: inset 0 8px 12px -4px rgba(255, 255, 255, .6), inset 0 -8px 12px -4px rgba(0, 0, 0, .4); margin-bottom: 0.5rem; color: white; text-shadow: 0 1px 2px black, 0 0 5px #ffd700;"
            },
            font: {
                  src: "",
                  name: "Playfair Display",
                  style: "font-weight: bold; font-style: italic;"
            },
            colors: {
                  background: "#333",
                  board: "#333",
                  border: "#111",
                  text: "#fff",
                  streets: [
                        "#4b3621", // Luxury brown (for bankrupt assets)
                        "#9ccfea", // Corporate blue (office buildings)
                        "#d882c1", // Investor pink (speculative capital)
                        "#e6b800", // Gold-orange (flagship properties)
                        "#cc0000", // Crisis red (troubled projects)
                        "#ffde59", // Yellow (glamour façade)
                        "#85bb65", // Green (prime real estate)
                        "#1a1a1a"  // Black (shadow finance)
                  ]
            },
            properties: {
                  utilities: [
                        { name: "Kika/Leiner Group", image: "", background: "#ededed" },
                        { name: "SIGNA Development", image: "", background: "#d9d9d9" }
                  ],
                  railroads: [
                        { name: "Vienna Central Hub", image: "/themes/default/railroad.svg", background: "" },
                        { name: "Berlin Projekt", image: "/themes/default/railroad.svg", background: "" },
                        { name: "Hamburg Hafen", image: "/themes/default/railroad.svg", background: "" },
                        { name: "Munich Megabau", image: "/themes/default/railroad.svg", background: "" }
                  ],
                  streets: [
                        { name: "Zukunftsquartier Innsbruck", background: "#3d2b1f" },
                        { name: "Karstadt-Ruine", background: "#5c4033" },
                        { name: "SIGNA Holding HQ", background: "#a3cde8" },
                        { name: "Benko Private Trust", background: "#b3d9f7" },
                        { name: "Alpine Bau GmbH", background: "#bce0f9" },
                        { name: "Credit Line Expansion", background: "#e6b3d1" },
                        { name: "Softbank Pitch", background: "#d68fb3" },
                        { name: "Middle East Loan", background: "#e2a9c0" },
                        { name: "Wiener Luxusresidenz", background: "#f5d76e" },
                        { name: "Hamburg Elbtor", background: "#f3c13a" },
                        { name: "Kaufhaus Tyrol", background: "#ffd700" },
                        { name: "Projekt Verzug", background: "#ff4c4c" },
                        { name: "Banken-Alarm", background: "#d11a2a" },
                        { name: "Staatsrettung", background: "#ff3333" },
                        { name: "Goldene Fassade", background: "#ffeb99" },
                        { name: "VIP Rooftop Bar", background: "#fff275" },
                        { name: "Champagner Lobby", background: "#ffe066" },
                        { name: "Alsterhaus", background: "#7fbf7f" },
                        { name: "KaDeWe Berlin", background: "#5ca86b" },
                        { name: "Park Hyatt Vienna", background: "#3b8c5a" },
                        { name: "SIGNA Prime", background: "#0a0a0a" },
                        { name: "Benko Penthouse", background: "#1a1a1a" },
                  ],
                  communityChest: { name: "Investor Mailbox", imageField: "/themes/default/community-chest.svg", imageCard: "/themes/default/community-chest.svg", styleCard: "", background: "" },
                  chance: { name: "Market Volatility", imageField: "/themes/default/chance.svg", imageCard: "/themes/default/chance.svg", styleCard: "", background: "" },
                  incomeTax: { name: "Real Estate Tax", image: "/themes/default/income-tax.svg", background: "" },
                  luxuryTax: { name: "Luxury Asset Levy", image: "/themes/default/luxury-tax.svg", background: "" },
                  go: { name: "Profit", salary: "From Investors", image: "/themes/default/go.svg", background: "" },
                  goToJail: { name: "Go to", image: "/themes/default/go-to-jail.svg", background: "" },
                  freeParking: { row1: "Investor", row2: "Retreat", image: "/themes/default/free-parking.svg", background: "" },
                  jail: { name: "Custody", image: "/themes/default/jail.svg", background: "" },
                  justVisiting: { row1: "Just", row2: "Visiting", background: "" }
            }
      }
];

export const theme = writable<App.Data.Theme.Model>(themes[0]);
