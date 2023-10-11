// @vitest-environment happy-dom

import { beforeEach, describe, expect, it, vi } from 'vitest';

import GoogleAnalytics from './google-analytics';
import gtag from './google-tag';
import type { GoogleAnalyticsParamsPrimitives } from './types';

const newDate = new Date('2020-01-01');
vi.mock('./google-tag');
vi.setSystemTime(newDate);

describe('@hexatool/google-analytics', () => {
	let ga: GoogleAnalytics;
	const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
	const GA_MEASUREMENT_ID_2 = 'G-YYYYYYYYYY';
	const GA_MEASUREMENT_ID_3 = 'G-ZZZZZZZZZZ';
	const FAKE_GOOGLE_TAG_URL = 'https://www.example.com/gtag/js';
	const FAKE_NONCE = 'fake-nonce';

	beforeEach(() => {
		vi.mocked(gtag).mockReset();
		document.getElementById('google-tag-manager')?.remove();
	});

	describe('constructor()', () => {
		it('new GoogleAnalytics(...measurementId: string[])', () => {
			// When
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID, GA_MEASUREMENT_ID_2);

			// Then
			expect(ga.defaultMeasurementId).toBe(GA_MEASUREMENT_ID);
			expect(ga.measurementIds).toStrictEqual([GA_MEASUREMENT_ID, GA_MEASUREMENT_ID_2]);
			expect(gtag).not.toHaveBeenCalled();
			const exist = document.getElementById('google-tag-manager') as HTMLScriptElement;
			expect(exist).toBeNull();
		});
		it('new GoogleAnalytics(...measurementId: string[]) with repeated ids', () => {
			// When
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID, GA_MEASUREMENT_ID, GA_MEASUREMENT_ID_2);

			// Then
			expect(ga.defaultMeasurementId).toBe(GA_MEASUREMENT_ID);
			expect(ga.measurementIds).toStrictEqual([GA_MEASUREMENT_ID, GA_MEASUREMENT_ID_2]);
			expect(gtag).not.toHaveBeenCalled();
			const exist = document.getElementById('google-tag-manager') as HTMLScriptElement;
			expect(exist).toBeNull();
		});
		it('new GoogleAnalytics(...measurementId: string[]) with invalid format', () => {
			// Given
			const badFormat = 'invalid-format';
			// @ts-expect-error Testing invalid format
			const fn = () => new GoogleAnalytics(badFormat);

			// When / Then
			expect(fn).toThrow(`Invalid Google Tag Measurement Id format. Expected 'G-XXXXXXXXXX'.`);

			// Then
			expect(gtag).not.toHaveBeenCalled();
			const exist = document.getElementById('google-tag-manager') as HTMLScriptElement;
			expect(exist).toBeNull();
		});
		it('new GoogleAnalytics(options: GoogleAnalyticsOptions)', () => {
			// When
			ga = new GoogleAnalytics({
				measurementId: [GA_MEASUREMENT_ID, GA_MEASUREMENT_ID_2],
			});

			// Then
			expect(ga.defaultMeasurementId).toBe(GA_MEASUREMENT_ID);
			expect(ga.measurementIds).toStrictEqual([GA_MEASUREMENT_ID, GA_MEASUREMENT_ID_2]);
			expect(gtag).not.toHaveBeenCalled();
			const exist = document.getElementById('google-tag-manager') as HTMLScriptElement;
			expect(exist).toBeNull();
		});
	});

	describe('addMeasurementId()', () => {
		it('addMeasurementId()', () => {
			// Given
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID, GA_MEASUREMENT_ID_2);

			// Then
			expect(ga.defaultMeasurementId).toBe(GA_MEASUREMENT_ID);
			expect(ga.measurementIds).toStrictEqual([GA_MEASUREMENT_ID, GA_MEASUREMENT_ID_2]);
			expect(gtag).not.toHaveBeenCalled();
			const exist = document.getElementById('google-tag-manager') as HTMLScriptElement;
			expect(exist).toBeNull();

			// When
			ga.addMeasurementId(GA_MEASUREMENT_ID_3);

			// Then
			expect(ga.defaultMeasurementId).toBe(GA_MEASUREMENT_ID);
			expect(ga.measurementIds).toStrictEqual([GA_MEASUREMENT_ID, GA_MEASUREMENT_ID_2, GA_MEASUREMENT_ID_3]);
			expect(gtag).not.toHaveBeenCalled();
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
			expect(gtag).toHaveBeenNthCalledWith(1, 'config', GA_MEASUREMENT_ID, {
				groups: ['test'],
			});
			const exist = document.getElementById('google-tag-manager') as HTMLScriptElement;
			expect(exist).not.toBeNull();
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
			expect(gtag).toHaveBeenNthCalledWith(1, 'config', GA_MEASUREMENT_ID_2, {
				groups: ['test'],
			});
			const exist = document.getElementById('google-tag-manager') as HTMLScriptElement;
			expect(exist).not.toBeNull();
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
			expect(gtag).toHaveBeenNthCalledWith(1, 'event', 'test');
			expect(gtag).toHaveBeenNthCalledWith(2, 'event', 'test', {
				foo: 'bar',
			});
			const exist = document.getElementById('google-tag-manager') as HTMLScriptElement;
			expect(exist).not.toBeNull();
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
			expect(gtag).toHaveBeenNthCalledWith(1, 'get', GA_MEASUREMENT_ID, 'test', callback);
			const exist = document.getElementById('google-tag-manager') as HTMLScriptElement;
			expect(exist).not.toBeNull();
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
			expect(gtag).toHaveBeenNthCalledWith(1, 'get', GA_MEASUREMENT_ID_2, 'test', callback);
			const exist = document.getElementById('google-tag-manager') as HTMLScriptElement;
			expect(exist).not.toBeNull();
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
			expect(gtag).toHaveBeenNthCalledWith(1, 'event', 'test');
			expect(gtag).toHaveBeenNthCalledWith(2, 'event', 'test', {
				foo: 'bar',
				send_to: GA_MEASUREMENT_ID_2,
			});
			const exist = document.getElementById('google-tag-manager') as HTMLScriptElement;
			expect(exist).not.toBeNull();
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
			expect(gtag).not.toHaveBeenCalled();
			const exist = document.getElementById('google-tag-manager') as HTMLScriptElement;
			expect(exist).not.toBeNull();
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
			expect(gtag).not.toHaveBeenCalled();
			const exist = document.getElementById('google-tag-manager') as HTMLScriptElement;
			expect(exist).toBeNull();
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
			expect(gtag).not.toHaveBeenCalled();
			const exist = document.getElementById('google-tag-manager') as HTMLScriptElement;
			expect(exist).not.toBeNull();

			// When
			ga.setTestMode(false);

			// Then
			expect(gtag).toHaveBeenNthCalledWith(1, 'event', 'test1');
			expect(gtag).toHaveBeenNthCalledWith(2, 'event', 'test2');

			// When
			ga.gtag('event', 'test3');
			ga.gtag('event', 'test4');

			// Then
			expect(gtag).toHaveBeenNthCalledWith(3, 'event', 'test3');
			expect(gtag).toHaveBeenNthCalledWith(4, 'event', 'test4');
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
			expect(gtag).toHaveBeenNthCalledWith(1, [1, 2], 'event', { foo: 'bar' });
			const exist = document.getElementById('google-tag-manager') as HTMLScriptElement;
			expect(exist).not.toBeNull();
		});
	});

	describe('initialize()', () => {
		it('initialize()', () => {
			// Given
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID, GA_MEASUREMENT_ID_2);

			// When
			ga.initialize();

			// Then
			expect(gtag).not.toHaveBeenCalled();
			const exist = document.getElementById('google-tag-manager') as HTMLScriptElement;
			expect(exist).not.toBeNull();
			expect(exist.src).toBe(`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`);
		});
		it('initialize() without measurement', () => {
			// Given
			ga = new GoogleAnalytics();
			const fn = () => ga.initialize();

			// When
			expect(fn).toThrow(`No Google Analytics Measurement ID provided.`);

			// Then
			expect(gtag).not.toHaveBeenCalled();
			const exist = document.getElementById('google-tag-manager') as HTMLScriptElement;
			expect(exist).toBeNull();
		});
		it('initialize(googleTagUrl?: string, nonce?: string)', () => {
			// Given
			ga = new GoogleAnalytics(GA_MEASUREMENT_ID, GA_MEASUREMENT_ID_2);

			// When
			ga.initialize(FAKE_GOOGLE_TAG_URL, FAKE_NONCE);

			// Then
			expect(gtag).not.toHaveBeenCalled();
			const exist = document.getElementById('google-tag-manager') as HTMLScriptElement;
			expect(exist).not.toBeNull();
			expect(exist.src).toBe(`${FAKE_GOOGLE_TAG_URL}?id=${GA_MEASUREMENT_ID}`);
			expect(exist.attributes.getNamedItem('nonce')?.value).toBe(FAKE_NONCE);
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
			expect(gtag).toHaveBeenNthCalledWith(1, 'set', GA_MEASUREMENT_ID, {
				country: 'US',
				currency: 'USD',
			});
			const exist = document.getElementById('google-tag-manager') as HTMLScriptElement;
			expect(exist).not.toBeNull();
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
			expect(gtag).toHaveBeenNthCalledWith(1, 'set', GA_MEASUREMENT_ID_2, {
				country: 'US',
				currency: 'USD',
			});
			const exist = document.getElementById('google-tag-manager') as HTMLScriptElement;
			expect(exist).not.toBeNull();
		});
	});
});
