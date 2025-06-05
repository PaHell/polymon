import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

import pkg from './package.json';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		port: 3000,
		strictPort: true,
	},
	optimizeDeps: {
		include: ['peerjs'],
	},
	ssr: {
		noExternal: Object.keys(pkg.dependencies || {})
	},
});
