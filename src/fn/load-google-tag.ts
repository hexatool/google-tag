import type { GoogleAnalyticsMeasurementId } from '../types';

const DEFAULT_GOOGLE_TAG_URL = 'https://www.googletagmanager.com/gtag/js';

export default function loadGoogleAnalytics(
	measurementID: GoogleAnalyticsMeasurementId,
	googleTagUrl = DEFAULT_GOOGLE_TAG_URL,
	nonce?: string,
	layer = 'dataLayer'
): void {
	const exist = document.getElementById('google-tag-manager');
	if (exist) {
		return;
	}
	const script = document.createElement('script');
	script.async = true;
	script.id = 'google-tag-manager';
	script.src = `${googleTagUrl}?id=${measurementID}${layer === 'dataLayer' ? '' : `&l=${layer}`}`;
	if (nonce) {
		script.setAttribute('nonce', nonce);
	}
	document.body.appendChild(script);

	// @ts-expect-error Custom dataLayer
	if (!(layer in window) || typeof window[layer] === 'undefined') {
		// @ts-expect-error Custom dataLayer
		window[layer] = [];
	}

	if (!('gtag' in window) || typeof window.gtag === 'undefined') {
		window.gtag = function gtag(...args: unknown[]) {
			// @ts-expect-error Custom dataLayer
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
			window[layer].push(args);
		};
	}
}
