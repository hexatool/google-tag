import { umdWrapper as umd } from 'esbuild-plugin-umd-wrapper';
import { defineConfig } from 'tsup';

export default defineConfig([
	{
		format: ['esm'],
		dts: true,
		clean: true,
		entry: {
			'google-analytics': './src/index.ts',
			'google-analytics-react': './src/react.ts',
		},
	},
	{
		// @ts-expect-error Invalid umd format
		format: ['umd'],
		minify: true,
		entry: {
			'google-analytics': './src/index.ts',
			'google-analytics-react': './src/react.ts',
		},
		outExtension: ({ format }) => ({
			js: `.${format === 'esm' ? '' : format}.min.js`,
		}),
		esbuildPlugins: [umd({ libraryName: 'GA' })],
	},
]);
