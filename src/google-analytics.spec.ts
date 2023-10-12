// @vitest-environment happy-dom

import { beforeEach, describe, expect, it, vi } from 'vitest';

import GoogleAnalytics from './google-analytics';
import type { GoogleAnalyticsArguments, GoogleAnalyticsParamsPrimitives } from './types';

const newDate = new Date('2020-01-01');
vi.setSystemTime(newDate);

describe('@hexatool/google-analytics', () => {
	let ga: GoogleAnalytics;
	const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
	const GA_MEASUREMENT_ID_2 = 'G-YYYYYYYYYY';
	const GA_MEASUREMENT_ID_3 = 'G-ZZZZZZZZZZ';
	const FAKE_GOOGLE_TAG_URL = 'https://www.example.com/gtag/js';
	const FAKE_NONCE = 'fake-nonce';
	const FAKE_LAYER = 'customLayer';

	function expectNotScript() {
		const exist = document.getElementById('google-tag-manager') as HTMLScriptElement;
		expect(exist).toBeNull();
	}

	function expectScript() {
		const exist = document.getElementById('google-tag-manager') as HTMLScriptElement;
		expect(exist).not.toBeNull();
	}

	function expectNotLayer() {
		expect(window.dataLayer).toBeUndefined();
	}

	function expectEmptyLayer() {
		expect(window.dataLayer).toBeDefined();
		expect(window.dataLayer.length).toBe(0);
	}

	function expectNotInit() {
		expectNotLayer();
		expectNotScript();
	}

	function expectArg(arg: GoogleAnalyticsArguments, index = 0, layer = 'dataLayer') {
		// @ts-expect-error Testing dataLayer
		expect(window[layer]).toBeDefined();
		// @ts-expect-error Testing dataLayer
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
		expect(window[layer].at(index)).toStrictEqual(arg);
	}

	beforeEach(() => {
		document.getElementById('google-tag-manager')?.remove();
		// @ts-expect-error Testing invalid delete
		delete window.dataLayer;
		// @ts-expect-error Testing invalid delete
		delete window.gtag;
		// @ts-expect-error Testing invalid delete
		// eslint-disable-next-line @typescript-eslint/no-dynamic-delete
		delete window[FAKE_LAYER];
	});

	describe('constructor()', () => {
		it('new GoogleAnalytics(...measurementId: string[])', () => {
			// When
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID, GA_MEASUREMENT_ID_2);

			// Then
			expect(ga.defaultMeasurementId).toBe(GA_MEASUREMENT_ID);
			expect(ga.measurementIds).toStrictEqual([GA_MEASUREMENT_ID, GA_MEASUREMENT_ID_2]);
			expectNotInit();
		});
		it('new GoogleAnalytics(...measurementId: string[]) with repeated ids', () => {
			// When
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID, GA_MEASUREMENT_ID, GA_MEASUREMENT_ID_2);

			// Then
			expect(ga.defaultMeasurementId).toBe(GA_MEASUREMENT_ID);
			expect(ga.measurementIds).toStrictEqual([GA_MEASUREMENT_ID, GA_MEASUREMENT_ID_2]);
			expectNotInit();
		});
		it('new GoogleAnalytics(...measurementId: string[]) with invalid format', () => {
			// Given
			const badFormat = 'invalid-format';
			// @ts-expect-error Testing invalid format
			const fn = () => new GoogleAnalytics(badFormat);

			// When / Then
			expect(fn).toThrow(`Invalid Google Tag Measurement Id format. Expected 'G-XXXXXXXXXX'.`);

			// Then
			expectNotInit();
		});
		it('new GoogleAnalytics(options: GoogleAnalyticsOptions)', () => {
			// When
			ga = new GoogleAnalytics({
				measurementId: [
					{
						measurementId: GA_MEASUREMENT_ID_3,
					},
					GA_MEASUREMENT_ID,
					GA_MEASUREMENT_ID_2,
				],
			});

			// Then
			expect(ga.defaultMeasurementId).toBe(GA_MEASUREMENT_ID_3);
			expect(ga.measurementIds).toStrictEqual([GA_MEASUREMENT_ID_3, GA_MEASUREMENT_ID, GA_MEASUREMENT_ID_2]);
			expectNotInit();
		});
	});

	describe('addMeasurementId()', () => {
		it('addMeasurementId(measurementId: string)', () => {
			// Given
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID, GA_MEASUREMENT_ID_2);

			// Then
			expect(ga.defaultMeasurementId).toBe(GA_MEASUREMENT_ID);
			expect(ga.measurementIds).toStrictEqual([GA_MEASUREMENT_ID, GA_MEASUREMENT_ID_2]);
			expectNotInit();

			// When
			ga.addMeasurementId(GA_MEASUREMENT_ID_3);

			// Then
			expect(ga.defaultMeasurementId).toBe(GA_MEASUREMENT_ID);
			expect(ga.measurementIds).toStrictEqual([GA_MEASUREMENT_ID, GA_MEASUREMENT_ID_2, GA_MEASUREMENT_ID_3]);
			expectNotInit();
		});
		it('addMeasurementId(measurementId: string, object: GoogleAnalyticsConfigParamsWithMeasurementId)', () => {
			// Given
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID);

			// Then
			expect(ga.defaultMeasurementId).toBe(GA_MEASUREMENT_ID);
			expect(ga.measurementIds).toStrictEqual([GA_MEASUREMENT_ID]);
			expectNotInit();

			// When
			ga.addMeasurementId(GA_MEASUREMENT_ID_3, {
				measurementId: GA_MEASUREMENT_ID_2,
			});

			// Then
			expect(ga.defaultMeasurementId).toBe(GA_MEASUREMENT_ID);
			expect(ga.measurementIds).toStrictEqual([GA_MEASUREMENT_ID, GA_MEASUREMENT_ID_3, GA_MEASUREMENT_ID_2]);
			expectNotInit();
		});
	});

	describe('config()', () => {
		it('config(params: GoogleAnalyticsConfigParams)', () => {
			// Given
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID, GA_MEASUREMENT_ID_2);
			ga.initialize();

			// When
			ga.config({
				groups: ['test'],
			});

			// Then
			expectArg(
				[
					'config',
					GA_MEASUREMENT_ID,
					{
						groups: ['test'],
					},
				],
				3
			);
			expectScript();
		});
		it('config(measurementID: GoogleAnalyticsMeasurementId, params?: GoogleAnalyticsConfigParams)', () => {
			// Given
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID, GA_MEASUREMENT_ID_2);
			ga.initialize();

			// When
			ga.config(GA_MEASUREMENT_ID_2, {
				groups: ['test'],
			});

			// Then
			expectArg(
				[
					'config',
					GA_MEASUREMENT_ID_2,
					{
						groups: ['test'],
					},
				],
				3
			);
			expectScript();
		});
	});

	describe('consent()', () => {
		it('consent(params: GoogleAnalyticsConsentParams)', () => {
			// Given
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID, GA_MEASUREMENT_ID_2);
			ga.initialize();

			// When
			ga.consent({
				ad_storage: 'denied',
				wait_for_update: 1000,
			});

			// Then
			expectArg(
				[
					'consent',
					{
						ad_storage: 'denied',
						wait_for_update: 1000,
					},
				],
				3
			);
			expectScript();
		});
	});

	describe('event()', () => {
		it('event(...args: GoogleTagArguments)', () => {
			// Given
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID);
			ga.initialize();

			// When
			ga.event('test');
			ga.event('test', {
				foo: 'bar',
			});

			// Then
			expectArg(['event', 'test'], 2);
			expectArg(
				[
					'event',
					'test',
					{
						foo: 'bar',
					},
				],
				3
			);
			expectScript();
		});
	});

	describe('get()', () => {
		it('get(field: string, callback: GoogleAnalyticsGetCallback)', () => {
			// Given
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID, GA_MEASUREMENT_ID_2);
			ga.initialize();
			const callback = (_result?: GoogleAnalyticsParamsPrimitives) => {
				// Callback
			};

			// When
			ga.get('test', callback);

			// Then
			expectArg(['get', GA_MEASUREMENT_ID, 'test', callback], 3);
			expectScript();
		});
		it('get(measurementID: GoogleAnalyticsMeasurementId, field: string, callback: GoogleAnalyticsGetCallback)', () => {
			// Given
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID, GA_MEASUREMENT_ID_2);
			ga.initialize();
			const callback = (_result?: GoogleAnalyticsParamsPrimitives) => {
				// Callback
			};

			// When
			ga.get(GA_MEASUREMENT_ID_2, 'test', callback);

			// Then
			expectArg(['get', GA_MEASUREMENT_ID_2, 'test', callback], 3);
			expectScript();
		});
	});

	describe('gtag()', () => {
		it('gtag(...args: GoogleTagArguments)', () => {
			// Given
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID);
			ga.initialize();

			// When
			ga.gtag('event', 'test');
			ga.gtag('event', 'test', {
				foo: 'bar',
				send_to: GA_MEASUREMENT_ID_2,
			});

			// Then
			expectArg(['event', 'test'], 2);
			expectArg(
				[
					'event',
					'test',
					{
						foo: 'bar',
						send_to: GA_MEASUREMENT_ID_2,
					},
				],
				3
			);
			expectScript();
		});
		it('gtag(...args: GoogleTagArguments) in test mode', () => {
			// Given
			ga = new GoogleAnalytics({
				testMode: true,
				measurementId: GA_MEASUREMENT_ID,
			});
			ga.initialize();

			// When
			ga.gtag('event', 'test');

			// Then
			expectEmptyLayer();
			expectScript();
		});
		it('gtag(...args: GoogleTagArguments) without initialize', () => {
			// Given
			ga = new GoogleAnalytics({
				testMode: true,
			});
			const fn = () => ga.gtag('event', 'test');

			// When / Then
			expect(fn).toThrow(`Google Analytics is not initialized.`);

			// Then
			expectNotInit();
		});
		it('gtag(...args: GoogleTagArguments) queue', () => {
			// Given
			ga = new GoogleAnalytics({
				testMode: true,
				measurementId: GA_MEASUREMENT_ID,
			});
			ga.initialize();

			// When
			ga.gtag('event', 'test1');
			ga.gtag('event', 'test2');

			// Then
			expectEmptyLayer();
			expectScript();

			// When
			ga.setTestMode(false);

			// Then
			expectArg(['event', 'test1'], 2);
			expectArg(['event', 'test2'], 3);

			// When
			ga.gtag('event', 'test3');
			ga.gtag('event', 'test4');

			// Then
			expectArg(['event', 'test3'], 4);
			expectArg(['event', 'test4'], 5);
		});
		it('gtag(...args: GoogleTagArguments) whatever', () => {
			// Given
			ga = new GoogleAnalytics({
				measurementId: GA_MEASUREMENT_ID,
			});
			ga.initialize();

			// When

			// @ts-expect-error Testing invalid arguments
			ga.gtag([1, 2], 'event', { foo: 'bar' });

			// Then

			// @ts-expect-error Testing invalid arguments
			expectArg([[1, 2], 'event', { foo: 'bar' }], 2);
			expectScript();
		});
	});

	describe('initialize()', () => {
		it('initialize()', () => {
			// Given
			ga = new GoogleAnalytics({
				measurementId: [
					GA_MEASUREMENT_ID,
					{
						measurementId: GA_MEASUREMENT_ID_2,
						user_id: '1',
						send_page_view: false,
					},
				],
			});

			// When
			ga.initialize();

			// Then
			expectArg(['js', newDate]);
			expectArg(['config', GA_MEASUREMENT_ID], 1);
			expectArg(
				[
					'config',
					GA_MEASUREMENT_ID_2,
					{
						user_id: '1',
						send_page_view: false,
					},
				],
				2
			);
			const exist = document.getElementById('google-tag-manager') as HTMLScriptElement;
			expect(exist).not.toBeNull();
			expect(exist.src).toBe(`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`);
			expect(window.dataLayer).toBeDefined();
			expect(window.dataLayer.length).toBe(3);
		});
		it('initialize() without measurement', () => {
			// Given
			ga = new GoogleAnalytics();
			const fn = () => ga.initialize();

			// When
			expect(fn).toThrow(`No Google Analytics Measurement ID provided.`);

			// Then
			expectNotInit();
		});
		it('initialize(googleTagUrl?: string, nonce?: string)', () => {
			// Given
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID, GA_MEASUREMENT_ID_2);

			// When
			ga.initialize({
				googleTagUrl: FAKE_GOOGLE_TAG_URL,
				nonce: FAKE_NONCE,
				layer: FAKE_LAYER,
			});
			ga.event('page_view');

			// Then
			const exist = document.getElementById('google-tag-manager') as HTMLScriptElement;
			expect(exist).not.toBeNull();
			expect(exist.src).toBe(`${FAKE_GOOGLE_TAG_URL}?id=${GA_MEASUREMENT_ID}&l=customLayer`);
			expect(exist.attributes.getNamedItem('nonce')?.value).toBe(FAKE_NONCE);
			expectArg(['event', 'page_view'], 3, FAKE_LAYER);
			expectNotLayer();
		});
	});

	describe('set()', () => {
		it('config(params: GoogleAnalyticsSetParams)', () => {
			// Given
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID, GA_MEASUREMENT_ID_2);
			ga.initialize();

			// When
			ga.set({
				country: 'US',
				currency: 'USD',
			});

			// Then
			expectArg(['set', GA_MEASUREMENT_ID, { country: 'US', currency: 'USD' }], 3);
			expectScript();
		});
		it('config(measurementID: GoogleAnalyticsMeasurementId, params: GoogleAnalyticsSetParams)', () => {
			// Given
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID, GA_MEASUREMENT_ID_2);
			ga.initialize();

			// When
			ga.set(GA_MEASUREMENT_ID_2, {
				country: 'US',
				currency: 'USD',
			});

			// Then
			expectArg(['set', GA_MEASUREMENT_ID_2, { country: 'US', currency: 'USD' }], 3);
			expectScript();
		});
	});
});
