import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { beforeAll, beforeEach, describe, expect, it, setSystemTime } from 'bun:test';

import GoogleTag from './google-tag';
import type { GoogleTagArguments, GoogleTagParamsPrimitives } from './types';

const newDate = new Date('2020-01-01');
setSystemTime(newDate);

describe('@hexatool/google-tag', () => {
	let gtag: GoogleTag;
	const MEASUREMENT_ID = 'GT-XXXXXXXXXX';
	const MEASUREMENT_ID_2 = 'G-YYYYYYYYYY';
	const MEASUREMENT_ID_3 = 'DC-ZZZZZZZZZZ';
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

	function expectLayer(layer: string, length?: number) {
		// @ts-expect-error Testing dataLayer
		expect(window[layer]).toBeDefined();
		if (length !== undefined) {
			// @ts-expect-error Testing dataLayer
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
			expect(window[layer].length).toBe(length);
		}
	}

	function expectNotLayer(layer = 'dataLayer') {
		// @ts-expect-error Testing dataLayer
		expect(window[layer]).toBeUndefined();
	}

	function expectEmptyLayer(layer = 'dataLayer') {
		// @ts-expect-error Testing dataLayer
		expect(window[layer]).toBeDefined();
		// @ts-expect-error Testing dataLayer
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
		expect(window[layer].length).toBe(0);
	}

	function expectNotInit(dataLayer = 'dataLayer') {
		expectLayer(dataLayer);
		expectNotScript();
	}

	function expectNotInitWithNoLayer() {
		expectNotLayer();
		expectNotScript();
	}

	function expectArg(arg: GoogleTagArguments, index = 0, layer = 'dataLayer') {
		// @ts-expect-error Testing dataLayer
		expect(window[layer]).toBeDefined();
		// @ts-expect-error Testing dataLayer
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
		expect(window[layer].at(index)).toStrictEqual(arg);
	}
	beforeAll(() => {
		GlobalRegistrator.register();
	});

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

	describe('new GoogleTag()', () => {
		it('new GoogleTag(...measurementId: GoogleTagMeasurementId[])', () => {
			// When
			gtag = new GoogleTag(MEASUREMENT_ID, MEASUREMENT_ID_2);

			// Then
			expect(gtag.defaultMeasurementId).toBe(MEASUREMENT_ID);
			expect(gtag.measurementIds).toStrictEqual([MEASUREMENT_ID, MEASUREMENT_ID_2]);
			expectNotInit();
		});
		it('new GoogleTag(...measurementId: GoogleTagMeasurementId[]) with repeated ids', () => {
			// When
			gtag = new GoogleTag(MEASUREMENT_ID, MEASUREMENT_ID, MEASUREMENT_ID_2);

			// Then
			expect(gtag.defaultMeasurementId).toBe(MEASUREMENT_ID);
			expect(gtag.measurementIds).toStrictEqual([MEASUREMENT_ID, MEASUREMENT_ID_2]);
			expectNotInit();
		});
		it('new GoogleTag(...measurementId: GoogleTagMeasurementId[]) with invalid format', () => {
			// Given
			const badFormat = 'UA-128378752-3';
			// @ts-expect-error Testing invalid format
			const fn = () => new GoogleTag(badFormat);

			// When / Then
			expect(fn).toThrow(`Invalid Google Tag Measurement Id format. Expected '[G|GT|AW|DC]-XXXXXXXXXX'.`);

			// Then
			expectNotInitWithNoLayer();
		});
		it('new GoogleTag(options: GoogleTagOptions)', () => {
			// When
			gtag = new GoogleTag({
				measurementId: [
					{
						measurementId: MEASUREMENT_ID_3,
					},
					MEASUREMENT_ID,
					MEASUREMENT_ID_2,
				],
			});

			// Then
			expect(gtag.defaultMeasurementId).toBe(MEASUREMENT_ID_3);
			expect(gtag.measurementIds).toStrictEqual([MEASUREMENT_ID_3, MEASUREMENT_ID, MEASUREMENT_ID_2]);
			expectNotInit();
		});
	});

	describe('addMeasurementId()', () => {
		it('addMeasurementId(measurementId: string)', () => {
			// Given
			gtag = new GoogleTag(MEASUREMENT_ID, MEASUREMENT_ID_2);

			// Then
			expect(gtag.defaultMeasurementId).toBe(MEASUREMENT_ID);
			expect(gtag.measurementIds).toStrictEqual([MEASUREMENT_ID, MEASUREMENT_ID_2]);
			expectNotInit();

			// When
			gtag.addMeasurementId(MEASUREMENT_ID_3);

			// Then
			expect(gtag.defaultMeasurementId).toBe(MEASUREMENT_ID);
			expect(gtag.measurementIds).toStrictEqual([MEASUREMENT_ID, MEASUREMENT_ID_2, MEASUREMENT_ID_3]);
			expectNotInit();
		});
		it('addMeasurementId(measurementId: string, object: GoogleTagConfigParamsWithMeasurementId)', () => {
			// Given
			gtag = new GoogleTag(MEASUREMENT_ID);

			// Then
			expect(gtag.defaultMeasurementId).toBe(MEASUREMENT_ID);
			expect(gtag.measurementIds).toStrictEqual([MEASUREMENT_ID]);
			expectNotInit();

			// When
			gtag.addMeasurementId(MEASUREMENT_ID_3, {
				measurementId: MEASUREMENT_ID_2,
			});

			// Then
			expect(gtag.defaultMeasurementId).toBe(MEASUREMENT_ID);
			expect(gtag.measurementIds).toStrictEqual([MEASUREMENT_ID, MEASUREMENT_ID_3, MEASUREMENT_ID_2]);
			expectNotInit();
		});
	});

	describe('config()', () => {
		it('config(params: GoogleTagConfigParams)', () => {
			// Given
			gtag = new GoogleTag(MEASUREMENT_ID, MEASUREMENT_ID_2);
			gtag.initialize();

			// When
			gtag.config({
				campaign_term: 'test',
			});

			// Then
			expectArg(
				[
					'config',
					MEASUREMENT_ID,
					{
						campaign_term: 'test',
					},
				],
				3
			);
			expectScript();
		});
		it('config(measurementID: GoogleTagMeasurementId, params?: GoogleTagConfigParams)', () => {
			// Given
			gtag = new GoogleTag(MEASUREMENT_ID, MEASUREMENT_ID_2);
			gtag.initialize();

			// When
			gtag.config(MEASUREMENT_ID_2, {
				page_title: 'test',
			});

			// Then
			expectArg(
				[
					'config',
					MEASUREMENT_ID_2,
					{
						page_title: 'test',
					},
				],
				3
			);
			expectScript();
		});
	});

	describe('consent()', () => {
		it('consent(action: GoogleTagConsentAction, params: GoogleTagConsentParams)', () => {
			// Given
			gtag = new GoogleTag(MEASUREMENT_ID, MEASUREMENT_ID_2);
			gtag.initialize();

			// When
			gtag.consent('update', {
				ad_storage: 'denied',
				wait_for_update: 1000,
			});

			// Then
			expectArg(
				[
					'consent',
					'update',
					{
						ad_storage: 'denied',
						wait_for_update: 1000,
					},
				],
				3
			);
			expectScript();
		});
		it('consent(action: GoogleTagConsentAction, params: GoogleTagConsentParams) set default before initialize()', () => {
			// Given
			gtag = new GoogleTag(MEASUREMENT_ID, MEASUREMENT_ID_2);

			// When
			gtag.consent('default', {
				ad_storage: 'denied',
				wait_for_update: 1000,
			});

			// Then
			expectNotInit();
			expectNotScript();
			expectArg(
				[
					'consent',
					'default',
					{
						ad_storage: 'denied',
						wait_for_update: 1000,
					},
				],
				0
			);

			// When
			gtag.initialize();

			// Then
			expectScript();
			expectArg(['js', newDate], 1);
			expectArg(['config', MEASUREMENT_ID], 2);
		});
	});

	describe('destroy()', () => {
		it('destroy()', () => {
			// Given
			gtag = new GoogleTag(MEASUREMENT_ID, MEASUREMENT_ID_2);
			gtag.initialize();

			// When
			gtag.gtag('event', 'test');
			gtag.gtag('event', 'test', {
				foo: 'bar',
				send_to: MEASUREMENT_ID_2,
			});

			// Then
			expectArg(['event', 'test'], 3);
			expectArg(
				[
					'event',
					'test',
					{
						foo: 'bar',
						send_to: MEASUREMENT_ID_2,
					},
				],
				4
			);
			expectScript();
			expectLayer('dataLayer', 5);

			// When
			gtag.setTestMode(true);
			gtag.gtag('event', 'test2');

			// Then
			expectLayer('dataLayer', 5);

			// When
			gtag.destroy();

			// Then
			expectNotInit();
			expectEmptyLayer();

			// When
			gtag.gtag('event', 'test3');

			// Then
			expectNotInit();
			expectArg(['event', 'test3'], 0);

			// When
			gtag.initialize();
			expectScript();
			expectArg(['js', newDate], 1);
			expectArg(['config', MEASUREMENT_ID], 2);
			expectArg(['config', MEASUREMENT_ID_2], 3);
			expectLayer('dataLayer', 4);
		});
	});

	describe('event()', () => {
		it('event(...args: GoogleTagArguments)', () => {
			// Given
			gtag = new GoogleTag(MEASUREMENT_ID);
			gtag.initialize();

			// When
			gtag.event('test');
			gtag.event('test', {
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
		it('get(field: string, callback: GoogleTagGetCallback)', () => {
			// Given
			gtag = new GoogleTag(MEASUREMENT_ID, MEASUREMENT_ID_2);
			gtag.initialize();
			const callback = (_result?: GoogleTagParamsPrimitives) => {
				// Callback
			};

			// When
			gtag.get('test', callback);

			// Then
			expectArg(['get', MEASUREMENT_ID, 'test', callback], 3);
			expectScript();
		});
		it('get(measurementID: GoogleTagMeasurementId, field: string, callback: GoogleTagGetCallback)', () => {
			// Given
			gtag = new GoogleTag(MEASUREMENT_ID, MEASUREMENT_ID_2);
			gtag.initialize();
			const callback = (_result?: GoogleTagParamsPrimitives) => {
				// Callback
			};

			// When
			gtag.get(MEASUREMENT_ID_2, 'test', callback);

			// Then
			expectArg(['get', MEASUREMENT_ID_2, 'test', callback], 3);
			expectScript();
		});
	});

	describe('gtag()', () => {
		it('gtag(...args: GoogleTagArguments)', () => {
			// Given
			gtag = new GoogleTag(MEASUREMENT_ID);
			gtag.initialize();

			// When
			gtag.gtag('event', 'test');
			gtag.gtag('event', 'test', {
				foo: 'bar',
				send_to: MEASUREMENT_ID_2,
			});

			// Then
			expectArg(['event', 'test'], 2);
			expectArg(
				[
					'event',
					'test',
					{
						foo: 'bar',
						send_to: MEASUREMENT_ID_2,
					},
				],
				3
			);
			expectScript();
		});
		it('gtag(...args: GoogleTagArguments) in test mode', () => {
			// Given
			gtag = new GoogleTag({
				testMode: true,
				measurementId: MEASUREMENT_ID,
			});
			gtag.initialize();

			// When
			gtag.gtag('event', 'test');

			// Then
			expectEmptyLayer();
			expectScript();
		});
		it('gtag(...args: GoogleTagArguments) without initialize', () => {
			// Given
			gtag = new GoogleTag({
				testMode: true,
			});

			// When / Then
			gtag.gtag('event', 'test');

			// Then
			expectEmptyLayer();
		});
		it('gtag(...args: GoogleTagArguments) queue', () => {
			// Given
			gtag = new GoogleTag({
				testMode: true,
				measurementId: MEASUREMENT_ID,
			});
			gtag.initialize();

			// When
			gtag.gtag('event', 'test1');
			gtag.gtag('event', 'test2');

			// Then
			expectEmptyLayer();
			expectScript();

			// When
			gtag.setTestMode(false);

			// Then
			expectArg(['event', 'test1'], 2);
			expectArg(['event', 'test2'], 3);

			// When
			gtag.gtag('event', 'test3');
			gtag.gtag('event', 'test4');

			// Then
			expectArg(['event', 'test3'], 4);
			expectArg(['event', 'test4'], 5);
		});
		it('gtag(...args: GoogleTagArguments) whatever', () => {
			// Given
			gtag = new GoogleTag({
				measurementId: MEASUREMENT_ID,
			});
			gtag.initialize();

			// When

			// @ts-expect-error Testing invalid arguments
			gtag.gtag([1, 2], 'event', { foo: 'bar' });

			// Then

			// @ts-expect-error Testing invalid arguments
			expectArg([[1, 2], 'event', { foo: 'bar' }], 2);
			expectScript();
		});
	});

	describe('initialize()', () => {
		it('initialize()', () => {
			// Given
			gtag = new GoogleTag({
				measurementId: [
					MEASUREMENT_ID,
					{
						measurementId: MEASUREMENT_ID_2,
						user_id: '1',
						send_page_view: false,
					},
				],
			});

			// When
			gtag.initialize();

			// Then
			expectArg(['js', newDate]);
			expectArg(['config', MEASUREMENT_ID], 1);
			expectArg(
				[
					'config',
					MEASUREMENT_ID_2,
					{
						user_id: '1',
						send_page_view: false,
					},
				],
				2
			);
			const exist = document.getElementById('google-tag-manager') as HTMLScriptElement;
			expect(exist).not.toBeNull();
			expect(exist.src).toBe(`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`);
			expect(window.dataLayer).toBeDefined();
			expect(window.dataLayer.length).toBe(3);
		});
		it('initialize() without measurement', () => {
			// Given
			gtag = new GoogleTag();
			const fn = () => gtag.initialize();

			// When
			expect(fn).toThrow(`No Google Analytics Measurement ID provided.`);

			// Then
			expectNotInit();
		});
		it('initialize(googleTagUrl?: string, nonce?: string)', () => {
			// Given
			gtag = new GoogleTag({
				measurementId: [MEASUREMENT_ID, MEASUREMENT_ID_2],
				layer: FAKE_LAYER,
			});

			// When
			gtag.initialize({
				googleTagUrl: FAKE_GOOGLE_TAG_URL,
				nonce: FAKE_NONCE,
			});
			gtag.event('page_view');

			// Then
			const exist = document.getElementById('google-tag-manager') as HTMLScriptElement;
			expect(exist).not.toBeNull();
			expect(exist.src).toBe(`${FAKE_GOOGLE_TAG_URL}?id=${MEASUREMENT_ID}&l=customLayer`);
			expect(exist.attributes.getNamedItem('nonce')?.value).toBe(FAKE_NONCE);
			expectArg(['event', 'page_view'], 3, FAKE_LAYER);
			expectNotLayer();
		});
	});

	describe('set()', () => {
		it('config(params: GoogleTagSetParams)', () => {
			// Given
			gtag = new GoogleTag(MEASUREMENT_ID, MEASUREMENT_ID_2);
			gtag.initialize();

			// When
			gtag.set({
				country: 'US',
				currency: 'USD',
			});

			// Then
			expectArg(['set', MEASUREMENT_ID, { country: 'US', currency: 'USD' }], 3);
			expectScript();
		});
		it('config(measurementID: GoogleTagMeasurementId, params: GoogleTagSetParams)', () => {
			// Given
			gtag = new GoogleTag(MEASUREMENT_ID, MEASUREMENT_ID_2);
			gtag.initialize();

			// When
			gtag.set(MEASUREMENT_ID_2, {
				country: 'US',
				currency: 'USD',
			});

			// Then
			expectArg(['set', MEASUREMENT_ID_2, { country: 'US', currency: 'USD' }], 3);
			expectScript();
		});
	});
});
