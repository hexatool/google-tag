import type { GoogleAnalyticsArguments } from './types';

const gtag = (...gtagArgs: GoogleAnalyticsArguments): void => {
	if (typeof window === 'undefined') {
		return;
	}

	if (!('gtag' in window)) {
		return;
	}
	if (typeof window.gtag !== 'function') {
		return;
	}
	window.gtag(...gtagArgs);
};

export default gtag;
