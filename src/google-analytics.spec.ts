// @vitest-environment happy-dom

import { beforeEach, describe, expect, it, vi } from 'vitest';

import GoogleAnalytics from './google-analytics';
import gtag from './google-tag';

const newDate = new Date('2020-01-01');
vi.mock('./google-tag');
vi.setSystemTime(newDate);

describe('@hexatool/google-analytics', () => {
	let ga: GoogleAnalytics;
	const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
	const GA_MEASUREMENT_ID_2 = 'G-YYYYYYYYYY';
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
});
