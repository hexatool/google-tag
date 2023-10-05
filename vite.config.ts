import formatFile from '@magnus-strategy/vite-plugin-format-filename';
import formatGlobals from '@magnus-strategy/vite-plugin-format-globals';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
	build: {
		target: 'ESNext',
		lib: {
			formats: ['es', 'umd'],
			entry: 'src/index',
		},
		minify: true,
		sourcemap: false,
		rollupOptions: {
			external: ['react'],
		},
	},
	plugins: [dts(), formatFile(), formatGlobals()],
});
