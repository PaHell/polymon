import { writable } from "svelte/store";

export const themes: App.Data.Theme[] = [
      {
            id: "default",
            name: "Default",
            currency: "$",
            branding: {
                  name: "Monopoly",
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
                  streets: {
                        brown: [
                              { name: "Old Kent Road", background: "" },
                              { name: "Whitechapel Road", background: "" }
                        ],
                        lightBlue: [
                              { name: "The Angel, Islington", background: "" },
                              { name: "Euston Road", background: "" },
                              { name: "Pentonville Road", background: "" }
                        ],
                        pink: [
                              { name: "Pall Mall", background: "" },
                              { name: "Whitehall", background: "" },
                              { name: "Northumberland Avenue", background: "" }
                        ],
                        orange: [
                              { name: "Bow Street", background: "" },
                              { name: "Marlborough Street", background: "" },
                              { name: "Vine Street", background: "" }
                        ],
                        red: [
                              { name: "Strand", background: "" },
                              { name: "Fleet Street", background: "" },
                              { name: "Trafalgar Square", background: "" }
                        ],
                        yellow: [
                              { name: "Leicester Square", background: "" },
                              { name: "Coventry Street", background: "" },
                              { name: "Piccadilly", background: "" }
                        ],
                        green: [
                              { name: "Regent Street", background: "" },
                              { name: "Oxford Street", background: "" },
                              { name: "Bond Street", background: "" }
                        ],
                        darkBlue: [
                              { name: "Park Lane", background: "" },
                              { name: "Mayfair", background: "" }
                        ]
                  },
                  communityChest: { name: "Community Chest", image: "/themes/default/community-chest.svg", background: "" },
                  chance: { name: "Chance", image: "/themes/default/chance.svg", background: "" },
                  incomeTax: { name: "Income Tax", image: "/themes/default/electric-company.svg", background: "" },
                  luxuryTax: { name: "Luxury Tax", image: "/themes/default/electric-company.svg", background: "" },
                  go: { name: "Go", image: "", background: "" },
                  goToJail: { name: "Go to Jail", image: "", background: "" },
                  freeParking: { name: "Free Parking", image: "", background: "" },
                  jail: { name: "In Jail", image: "", background: "" }
            }
      },
      {
            id: "signa-bust",
            name: "Signa Bust",
            currency: "€",
            branding: {
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
                  background: "#f3f3f3",
                  board: "#ffffff",
                  border: "#333333",
                  text: "#1a1a1a",
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
                        { name: "Vienna Central Hub", image: "", background: "#bcccdc" },
                        { name: "Berlin Projekt", image: "", background: "#abc4ff" },
                        { name: "Hamburg Hafen", image: "", background: "#ddeeff" },
                        { name: "Munich Megabau", image: "", background: "#ccddee" }
                  ],
                  streets: {
                        brown: [
                              { name: "Zukunftsquartier Innsbruck", background: "#3d2b1f" },
                              { name: "Karstadt-Ruine", background: "#5c4033" }
                        ],
                        lightBlue: [
                              { name: "SIGNA Holding HQ", background: "#a3cde8" },
                              { name: "Benko Private Trust", background: "#b3d9f7" },
                              { name: "Alpine Bau GmbH", background: "#bce0f9" }
                        ],
                        pink: [
                              { name: "Credit Line Expansion", background: "#e6b3d1" },
                              { name: "Softbank Pitch", background: "#d68fb3" },
                              { name: "Middle East Loan", background: "#e2a9c0" }
                        ],
                        orange: [
                              { name: "Wiener Luxusresidenz", background: "#f5d76e" },
                              { name: "Hamburg Elbtor", background: "#f3c13a" },
                              { name: "Kaufhaus Tyrol", background: "#ffd700" }
                        ],
                        red: [
                              { name: "Projekt Verzug", background: "#ff4c4c" },
                              { name: "Banken-Alarm", background: "#d11a2a" },
                              { name: "Staatsrettung", background: "#ff3333" }
                        ],
                        yellow: [
                              { name: "Goldene Fassade", background: "#ffeb99" },
                              { name: "VIP Rooftop Bar", background: "#fff275" },
                              { name: "Champagner Lobby", background: "#ffe066" }
                        ],
                        green: [
                              { name: "Alsterhaus", background: "#7fbf7f" },
                              { name: "KaDeWe Berlin", background: "#5ca86b" },
                              { name: "Park Hyatt Vienna", background: "#3b8c5a" }
                        ],
                        darkBlue: [
                              { name: "SIGNA Prime", background: "#0a0a0a" },
                              { name: "Benko Penthouse", background: "#1a1a1a" }
                        ]
                  },
                  communityChest: { name: "Investor Mailbox", image: "", background: "#f0e68c" },
                  chance: { name: "Market Volatility", image: "", background: "#ffcc00" },
                  incomeTax: { name: "Real Estate Tax", image: "", background: "#b22222" },
                  luxuryTax: { name: "Luxury Asset Levy", image: "", background: "#800000" },
                  go: { name: "Start Over", image: "", background: "#2ecc71" },
                  goToJail: { name: "Go to Investigative Custody", image: "", background: "#e74c3c" },
                  freeParking: { name: "Investor Retreat", image: "", background: "#95a5a6" },
                  jail: { name: "In Custody", image: "", background: "#7f8c8d" }
            }
      }
];

export const theme = writable<App.Data.Theme>(themes[0]);
