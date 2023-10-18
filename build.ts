import esbuild from 'esbuild';
import umd from 'esbuild-plugin-umd-wrapper';

await Promise.all([
	esbuild.build({
		entryPoints: ['src/index.ts'],
		outdir: './dist',
		format: 'esm',
		platform: 'node',
		target: 'esnext',
		bundle: true,
		entryNames: 'google-analytics',
	}),
	esbuild.build({
		entryPoints: ['src/index.ts'],
		outdir: './dist',
		// @ts-expect-error umd plugin is not typed
		format: 'umd',
		platform: 'browser',
		target: 'esnext',
		bundle: true,
		minify: true,
		entryNames: 'google-analytics.umd.min',
		plugins: [umd()],
	}),
]);
