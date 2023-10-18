import { umdWrapper as umd } from 'esbuild-plugin-umd-wrapper';
import { defineConfig } from 'tsup';

export default defineConfig([
	{
		format: ['esm', 'cjs'],
		dts: true,
		clean: true,
		entry: {
			'google-tag': './src/index.ts',
			'google-tag-react': './src/react.ts',
		},
	},
	{
		// @ts-expect-error Invalid umd format
		format: ['umd'],
		minify: true,
		entry: {
			'google-tag': './src/index.ts',
			'google-tag-react': './src/react.ts',
		},
		outExtension: () => ({
			js: `.umd.min.js`,
		}),
		esbuildPlugins: [umd({ libraryName: 'GA' })],
	},
]);
