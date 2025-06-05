// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		namespace Data {
			interface Player {
				id: string;
				figureId: string;
				isReady: boolean;
			}
			interface Bot {
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
		}
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
