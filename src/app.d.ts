// See https://svelte.dev/docs/kit/types#app.d.ts

// for information about these interfaces
declare global {
	namespace App {
		namespace Data {
			type Player = {
				id: string;
				figureId: string;
				isReady: boolean;
			}
			type Bot = {
				id: string;
				name: string;
				figureId: string;
			}
			type Figure = {
				id: string;
				name: string;
				value: string;
				isUrl: boolean;
			}
			type Utility = {
				name: string;
				image: string;
				background?: string;
			}
			type Railroad = Utility;
			type CommunityChest = Utility;
			type Chance = Utility;
			type IncomeTax = Utility;
			type LuxuryTax = Utility;
			type Go = Utility;
			type GoToJail = Utility;
			type FreeParking = Utility;
			type Jail = Utility;
			type Property = {
				name: string;
				background?: string;
			}
			type Theme = {
				id: string;
				name: string;
				currency: string;
				branding: {
					name: string;
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
export { };
