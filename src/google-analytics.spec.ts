// @vitest-environment happy-dom

import { beforeEach, describe, expect, it, vi } from 'vitest';

import GoogleAnalytics from './google-analytics';
import gtag from './google-tag';
import type { GoogleAnalyticsCommonOptions, GoogleAnalyticsEvent } from './types';

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
			const object = { hitType: 'pageview', page: '/' } as const;

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
			const options = [
				{
					trackingId: GA_MEASUREMENT_ID,
					gaOptions: {
						cookieUpdate: false,
					},
				},
				GA_MEASUREMENT_ID2,
			];

			// When
			ga = new GoogleAnalytics(options, {
				gtagOptions: {
					anonymize_ip: true,
				},
			});

			// Then
			expect(gtag).toHaveBeenNthCalledWith(1, 'js', newDate);
			expect(gtag).toHaveBeenNthCalledWith(2, 'config', GA_MEASUREMENT_ID, {
				anonymize_ip: true,
				cookie_update: false,
			});
			expect(gtag).toHaveBeenNthCalledWith(3, 'config', GA_MEASUREMENT_ID2, {
				anonymize_ip: true,
			});
			expect(gtag).toHaveBeenCalledTimes(3);
			const exist = document.getElementById('google-tag-manager') as HTMLScriptElement;
			expect(exist).not.toBeNull();
			expect(exist.src).toBe(`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`);
		});
	});

	describe('ga()', () => {
		it('ga() send pageview', () => {
			// Given
			const command = 'send' as const;
			const object = { hitType: 'pageview' } as const;
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID);

			// When
			ga.ga(command, object);

			// Then
			expect(gtag).toHaveBeenNthCalledWith(3, 'event', 'page_view');
		});
	});

	describe('event()', () => {
		it('event() custom events', () => {
			// Given
			const eventName = 'screen_view';
			const eventParams = {
				app_name: 'myAppName',
				screen_name: 'Home',
			};
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID);

			// When
			ga.event(eventName, eventParams);

			// Then
			expect(gtag).toHaveBeenNthCalledWith(3, 'event', eventName, eventParams);
		});

		it('event() simple', () => {
			// Given
			const object: GoogleAnalyticsEvent = {
				category: 'category value',
				action: 'action value',
				label: 'label value',
				nonInteraction: true,
			};
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID);

			// When
			ga.event(object);

			// Then
			expect(gtag).toHaveBeenNthCalledWith(3, 'event', 'action value', {
				event_category: 'category value',
				event_label: 'label value',
				non_interaction: true,
			});
		});
	});

	describe('set()', () => {
		it('set()', () => {
			// Given
			const object = {
				anonymizeIp: true,
				referrer: '/signup',
				allowAdFeatures: 'allowAdFeatures value',
				allowAdPersonalizationSignals: 'allowAdPersonalizationSignals value',
				page: '/home',
			};
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID);

			// When
			ga.set(object);

			// Then
			expect(gtag).toHaveBeenNthCalledWith(3, 'set', {
				anonymize_ip: true,
				referrer: '/signup',
				allow_google_signals: 'allowAdFeatures value',
				allow_ad_personalization_signals: 'allowAdPersonalizationSignals value',
				page_path: '/home',
			});
		});
	});
});
