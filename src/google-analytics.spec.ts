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
		it(`ga('send', 'pageview')`, () => {
			// Given
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID);

			// When
			ga.ga('send', 'pageview');

			// Then
			expect(gtag).toHaveBeenNthCalledWith(3, 'event', 'page_view');
		});
		it(`ga('send', 'pageview', '/location-pathname')`, () => {
			// Given
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID);

			// When
			ga.ga('send', 'pageview', '/location-pathname');

			// Then
			expect(gtag).toHaveBeenNthCalledWith(3, 'event', 'page_view', {
				page_path: '/location-pathname',
			});
		});
		it(`ga('send', 'pageview', '/location-pathname', object) with path`, () => {
			// Given
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID);

			// When
			ga.ga('send', 'pageview', '/location-pathname', { title: 'title value' });

			// Then
			expect(gtag).toHaveBeenNthCalledWith(3, 'event', 'page_view', {
				page_path: '/location-pathname',
				page_title: 'title value',
			});
		});
		it(`ga('send', 'timing', timingCategory, timingVar, timingValue)`, () => {
			// Given
			const timingCategory = 'DOM';
			const timingVariable = 'first-contentful-paint';
			const timingValue = 120;
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID);

			// When
			ga.ga('send', 'timing', timingCategory, timingVariable, timingValue);

			// Then
			expect(gtag).toHaveBeenNthCalledWith(3, 'event', 'timing_complete', {
				event_category: timingCategory,
				name: timingVariable,
				value: timingValue,
			});
		});
		it(`ga({ hitType: 'pageview' })`, () => {
			// Given
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID);

			// When
			ga.ga('send', { hitType: 'pageview' });

			// Then
			expect(gtag).toHaveBeenNthCalledWith(3, 'event', 'page_view');
		});
	});

	describe('event()', () => {
		it(`event('screen_view', object)`, () => {
			// Given
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID);

			// When
			ga.event('screen_view', { app_name: 'myAppName', screen_name: 'Home' });

			// Then
			expect(gtag).toHaveBeenNthCalledWith(3, 'event', 'screen_view', {
				app_name: 'myAppName',
				screen_name: 'Home',
			});
		});

		it('event(object)', () => {
			// Given
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID);

			// When
			ga.event({
				category: 'category value',
				action: 'action value',
				label: 'label value',
				nonInteraction: true,
			});

			// Then
			expect(gtag).toHaveBeenNthCalledWith(3, 'event', 'action value', {
				event_category: 'category value',
				event_label: 'label value',
				non_interaction: true,
			});
		});
	});

	describe('send()', () => {
		it(`send('pageview')`, () => {
			// Given
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID);

			// When
			ga.send('pageview');

			// Then
			expect(gtag).toHaveBeenNthCalledWith(3, 'event', 'page_view');
		});
		it('send(object)', () => {
			// Given
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID);

			// When
			ga.send({ hitType: 'pageview' });

			// Then
			expect(gtag).toHaveBeenNthCalledWith(3, 'event', 'page_view');
		});
		it('send(object) web vitals', () => {
			// Given
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID);

			// https://github.com/GoogleChrome/web-vitals/blob/main/README.md
			function sendToGoogleAnalytics({
				name,
				delta,
				value,
				id,
			}: {
				delta: number;
				id: string;
				name: string;
				value: number;
			}) {
				ga.send({
					hitType: 'event',
					eventCategory: 'Web Vitals',
					eventAction: name,
					eventLabel: id,
					nonInteraction: true,
					// Use `delta` so the value can be summed.
					value: Math.round(name === 'CLS' ? delta * 1000 : delta),
					// Needed to aggregate events.
					metric_id: id,
					// Optional.
					metric_value: value,
					// Optional.
					metric_delta: delta,

					/*
					 * OPTIONAL: any additional params or debug info here.
					 * See: https://web.dev/debug-web-vitals-in-the-field/
					 * metric_rating: 'good' | 'ni' | 'poor',
					 * debug_info: '...',
					 * ...
					 */
				});
			}

			// When
			sendToGoogleAnalytics({
				name: 'CLS',
				delta: 12.34,
				value: 1,
				id: 'v2-1632380328370-6426221164013',
			});

			// Then
			expect(gtag).toHaveBeenNthCalledWith(3, 'event', 'CLS', {
				event_category: 'Web Vitals',
				event_label: 'v2-1632380328370-6426221164013',
				metric_delta: 12.34,
				metric_id: 'v2-1632380328370-6426221164013',
				metric_value: 1,
				non_interaction: true,
				value: 12340,
			});
		});
		it('send(object) with path', () => {
			// Given
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID);

			// When
			ga.send({ hitType: 'pageview', page: '/location-pathname' });

			// Then
			expect(gtag).toHaveBeenNthCalledWith(3, 'event', 'page_view', {
				page_path: '/location-pathname',
			});
		});
		it('send(object) with path and title', () => {
			// Given
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID);

			// When
			ga.send({ hitType: 'pageview', page: '/location-pathname', title: 'title value' });

			// Then
			expect(gtag).toHaveBeenNthCalledWith(3, 'event', 'page_view', {
				page_path: '/location-pathname',
				page_title: 'title value',
			});
		});
	});

	describe('set()', () => {
		it('set(object)', () => {
			// Given
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID);

			// When
			ga.set({
				anonymizeIp: true,
				referrer: '/signup',
				allowAdFeatures: 'allowAdFeatures value',
				allowAdPersonalizationSignals: 'allowAdPersonalizationSignals value',
				page: '/home',
			});

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
