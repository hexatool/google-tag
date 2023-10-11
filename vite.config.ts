import type { ModuleFormat } from 'rollup';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

function filePrefix(packageName: string): string {
	return packageName.replaceAll('@', '').replaceAll('/', '-').toLowerCase();
}

function fileName(
	format: ModuleFormat,
	entryName: string,
	pkgName = '',
	minify?: boolean | 'esbuild' | 'terser'
): string {
	const file = filePrefix(pkgName);
	const sufix = entryName === 'index' || entryName === 'main' ? '' : `-${entryName}`;
	const preExtension = format === 'umd' ? '.umd' : '';
	const minExtension = minify ? '.min' : '';
	const extension = format === 'es' ? '.mjs' : format === 'cjs' ? 'cjs' : '.js';

	return `${file}${sufix}${preExtension}${minExtension}${extension}`;
}

export default defineConfig({
	build: {
		target: 'ESNext',
		lib: {
			name: 'GA',
			formats: ['es', 'umd'],
			entry: 'src/index',
			fileName: (format, entryName) => {
				return fileName(format, entryName, 'google-analytics', true);
			},
		},
		minify: true,
		sourcemap: false,
	},
	plugins: [
		dts({
			entryRoot: 'src',
			include: 'src/**/*',
			exclude: ['**/__tests__/**/*', '**/__mocks__/**/*', '**/*.spec.ts', '**/*.test.ts'],
		}),
	],
});
