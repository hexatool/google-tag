/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

// eslint-disable-next-line import/prefer-default-export
export declare global {
	interface Window {
		dataLayer: unknown[];
		gtag: (...args: unknown[]) => void;
	}
}
