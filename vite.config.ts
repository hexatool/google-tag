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
	},
	plugins: [dts()],
});
