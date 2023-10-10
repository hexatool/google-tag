import type { GoogleTagMeasurementId } from '../types';

const DEFAULT_GOOGLE_TAG_URL = 'https://www.googletagmanager.com/gtag/js';

export default function loadGoogleTagManager(
	measurementID: GoogleTagMeasurementId,
	googleTagUrl = DEFAULT_GOOGLE_TAG_URL,
	nonce?: string
): void {
	const exist = document.getElementById('google-tag-manager');
	if (exist) {
		return;
	}
	const script = document.createElement('script');
	script.async = true;
	script.id = 'google-tag-manager';
	script.src = `${googleTagUrl}?id=${measurementID}`;
	if (nonce) {
		script.setAttribute('nonce', nonce);
	}
	document.body.appendChild(script);

	if (!('dataLayer' in window) || typeof window.dataLayer === 'undefined') {
		window.dataLayer = [];
	}

	if (!('gtag' in window) || typeof window.gtag === 'undefined') {
		window.gtag = function gtag(...args: unknown[]) {
			window.dataLayer.push(args);
		};
	}
}
