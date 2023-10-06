const gtag = (...gtagArgs: unknown[]): void => {
	if (typeof window !== 'undefined') {
		if (!('gtag' in window) || typeof window.gtag === 'undefined') {
			window.dataLayer = window.dataLayer ?? [];
			window.gtag = function gtag(...args: unknown[]) {
				window.dataLayer?.push(args);
			};
		}

		window.gtag(...gtagArgs);
	}
};

export default gtag;
