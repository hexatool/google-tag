// @vitest-environment happy-dom

import { beforeEach, describe, expect, it, vi } from 'vitest';

import GoogleAnalytics from './google-analytics';
import gtag from './google-tag';
import type { GoogleAnalyticsCommonOptions } from './types';

const newDate = new Date('2020-01-01');
vi.mock('./google-tag');
vi.setSystemTime(newDate);

describe('@hexatool/google-analytics', () => {
	let ga: GoogleAnalytics;
	const GA_MEASUREMENT_ID = 'GA_MEASUREMENT_ID';

	beforeEach(() => {
		vi.mocked(gtag).mockReset();
		document.getElementById('google-tag-manager')?.remove();
	});

	describe('initialize()', () => {
		it('initialize() default', () => {
			// When
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID);

			// Then
			expect(gtag).toHaveBeenNthCalledWith(1, 'js', newDate);
			expect(gtag).toHaveBeenNthCalledWith(2, 'config', GA_MEASUREMENT_ID);
			expect(gtag).toHaveBeenCalledTimes(2);
			const exist = document.getElementById('google-tag-manager') as HTMLScriptElement;
			expect(exist).not.toBeNull();
			expect(exist.src).toBe(`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`);
		});

		it('initialize() with options', () => {
			// Given
			const options: GoogleAnalyticsCommonOptions = {
				nonce: '490e5324-1982-4c2e-aced-efa88f597adc',
				gaOptions: {
					cookieUpdate: false,
				},
			};

			// When
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID, options);

			// Then
			expect(gtag).toHaveBeenNthCalledWith(1, 'js', newDate);
			expect(gtag).toHaveBeenNthCalledWith(2, 'config', GA_MEASUREMENT_ID, {
				cookie_update: false,
			});
			expect(gtag).toHaveBeenCalledTimes(2);
			const exist = document.getElementById('google-tag-manager') as HTMLScriptElement;
			expect(exist).not.toBeNull();
			expect(exist.src).toBe(`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`);
			expect(exist.attributes.getNamedItem('nonce')?.value).toBe('490e5324-1982-4c2e-aced-efa88f597adc');
		});
		it('initialize() in test mode', () => {
			// Given
			const options = {
				testMode: true,
			};
			const command = 'send';
			const object = { hitType: 'pageview' };

			// When
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID, options);
			ga.ga(command, object);

			// Then
			expect(gtag).toHaveBeenCalledTimes(0);
			const exist = document.getElementById('google-tag-manager') as HTMLScriptElement;
			expect(exist).toBeNull();
		});
		it('initialize() multiple products', () => {
			// Given
			const GA_MEASUREMENT_ID2 = 'GA_MEASUREMENT_ID2';
			const options = [{ trackingId: GA_MEASUREMENT_ID }, { trackingId: GA_MEASUREMENT_ID2 }];

			// When
			ga = new GoogleAnalytics(options);

			// Then
			expect(gtag).toHaveBeenNthCalledWith(1, 'js', newDate);
			expect(gtag).toHaveBeenNthCalledWith(2, 'config', GA_MEASUREMENT_ID);
			expect(gtag).toHaveBeenNthCalledWith(3, 'config', GA_MEASUREMENT_ID2);
			expect(gtag).toHaveBeenCalledTimes(3);
			const exist = document.getElementById('google-tag-manager') as HTMLScriptElement;
			expect(exist).not.toBeNull();
			expect(exist.src).toBe(`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`);
		});
	});
});
