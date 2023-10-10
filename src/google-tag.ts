import type { GoogleTagArguments } from './types';

const gtag = (...gtagArgs: GoogleTagArguments): void => {
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
