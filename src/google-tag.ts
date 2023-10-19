import type {
	GoogleTagArguments,
	GoogleTagConfigArguments,
	GoogleTagConfigParams,
	GoogleTagConsentArguments,
	GoogleTagConsentParams,
	GoogleTagCustomEventArguments,
	GoogleTagEvent,
	GoogleTagEventCommonParams,
	GoogleTagExceptionEventArguments,
	GoogleTagExceptionEventParams,
	GoogleTagGetArguments,
	GoogleTagGetCallback,
	GoogleTagJsArguments,
	GoogleTagLoginEventArguments,
	GoogleTagLoginEventParams,
	GoogleTagMeasurementId,
	GoogleTagPageViewEventArguments,
	GoogleTagPageViewEventParams,
	GoogleTagSetArguments,
	GoogleTagSetMeasurementIdArguments,
	GoogleTagSetParams,
	InitializeOptions,
} from './types';

interface GoogleTagConfigParamsWithMeasurementId extends GoogleTagConfigParams {
	measurementId: GoogleTagMeasurementId;
}

interface GoogleTagOptions {
	allowAdPersonalizationSignals?: false;
	measurementId?:
		| GoogleTagMeasurementId
		| GoogleTagConfigParamsWithMeasurementId
		| (GoogleTagMeasurementId | GoogleTagConfigParamsWithMeasurementId)[];
	testMode?: boolean;
}

const GOOGLE_TAG_MEASUREMENT_ID_REGEXP = /^(?:G|GT|AW|DC)-[A-Z0-9]{10}$/;
const DEFAULT_GOOGLE_TAG_URL = 'https://www.googletagmanager.com/gtag/js';

class GoogleTag {
	readonly #allowAdPersonalizationSignals?: false;
	#initialize: boolean;
	readonly #isQueuing: boolean;
	readonly #measurementId: Map<GoogleTagMeasurementId, GoogleTagConfigParams>;
	readonly #queueGtag: GoogleTagArguments[];
	#testMode: boolean;

	constructor(...measurementIds: GoogleTagMeasurementId[]);
	constructor(options: GoogleTagOptions);
	constructor(...args: [GoogleTagOptions | GoogleTagMeasurementId, ...GoogleTagMeasurementId[]]) {
		if (typeof window === 'undefined' || typeof document === 'undefined') {
			throw new Error(`'GoogleTag' is only available in the browser.`);
		}
		const [first, ...rest] = args;
		this.#measurementId = new Map();
		this.#queueGtag = [];
		this.#testMode = false;
		this.#isQueuing = false;
		this.#initialize = false;
		if (typeof first === 'string') {
			this.addMeasurementId(first, ...rest);
		} else if (typeof first === 'object') {
			const { allowAdPersonalizationSignals, measurementId, testMode = false } = first;
			this.#testMode = testMode;
			if (allowAdPersonalizationSignals === false) {
				this.#allowAdPersonalizationSignals = allowAdPersonalizationSignals;
			}
			if (typeof measurementId === 'string') {
				this.addMeasurementId(measurementId);
			} else if (Array.isArray(measurementId)) {
				this.addMeasurementId(...measurementId);
			}
		}
		this.measurementIds.forEach(v => {
			this.#assertMeasurementId(v);
		});
	}

	get defaultMeasurementId(): GoogleTagMeasurementId | undefined {
		return this.measurementIds[0];
	}

	get measurementIds(): GoogleTagMeasurementId[] {
		return Array.from(this.#measurementId.keys());
	}

	get #someQueued(): boolean {
		return this.#queueGtag.length > 0;
	}

	addMeasurementId(...measurementId: (GoogleTagMeasurementId | GoogleTagConfigParamsWithMeasurementId)[]): void {
		for (const id of measurementId) {
			if (typeof id === 'string' && this.#assertMeasurementId(id)) {
				this.#measurementId.set(id, {});
			} else if (typeof id === 'object' && this.#assertMeasurementId(id.measurementId)) {
				const { measurementId: _, ...rest } = id;
				this.#measurementId.set(id.measurementId, rest);
			}
		}
	}

	config(params: GoogleTagConfigParams): void;
	config(measurementID: GoogleTagMeasurementId, params?: GoogleTagConfigParams): void;
	config(
		measurementIdOrParams: GoogleTagMeasurementId | GoogleTagConfigParams,
		params?: GoogleTagConfigParams
	): void {
		if (typeof measurementIdOrParams === 'string') {
			if (params && Object.keys(params).length === 0) {
				this.gtag('config', measurementIdOrParams);
			} else {
				this.gtag('config', measurementIdOrParams, params);
			}
		} else if (this.defaultMeasurementId && typeof measurementIdOrParams === 'object') {
			if (Object.keys(measurementIdOrParams).length === 0) {
				this.gtag('config', this.defaultMeasurementId);
			} else {
				this.gtag('config', this.defaultMeasurementId, measurementIdOrParams);
			}
		}
	}

	consent(params: GoogleTagConsentParams): void {
		this.gtag('consent', params);
	}

	event(event: 'login', params?: GoogleTagLoginEventParams): void;
	event(event: 'exception', params?: GoogleTagExceptionEventParams): void;
	event(event: 'page_view', params?: GoogleTagPageViewEventParams): void;
	event(event: string, params?: GoogleTagEventCommonParams): void;
	event(event: GoogleTagEvent, params?: GoogleTagEventCommonParams): void {
		if (params) {
			this.gtag('event', event, params);
		} else {
			this.gtag('event', event);
		}
	}

	get(field: string, callback: GoogleTagGetCallback): void;
	get(measurementID: GoogleTagMeasurementId, field: string, callback: GoogleTagGetCallback): void;
	get(
		fieldOrMeasurementID: string,
		fieldOrCallBack: string | GoogleTagGetCallback,
		callback?: GoogleTagGetCallback
	): void {
		if (this.#isGoogleTagMeasurementId(fieldOrMeasurementID) && typeof fieldOrCallBack === 'string' && callback) {
			this.gtag('get', fieldOrMeasurementID, fieldOrCallBack, callback);
		} else if (
			this.defaultMeasurementId &&
			typeof fieldOrMeasurementID === 'string' &&
			typeof fieldOrCallBack === 'function'
		) {
			this.gtag('get', this.defaultMeasurementId, fieldOrMeasurementID, fieldOrCallBack);
		}
	}

	gtag(...args: GoogleTagJsArguments): void;
	gtag(...args: GoogleTagPageViewEventArguments): void;
	gtag(...args: GoogleTagExceptionEventArguments): void;
	gtag(...args: GoogleTagLoginEventArguments): void;
	gtag(...args: GoogleTagCustomEventArguments): void;
	gtag(...args: GoogleTagConfigArguments): void;
	gtag(...args: GoogleTagGetArguments): void;
	gtag(...args: GoogleTagSetArguments): void;
	gtag(...args: GoogleTagSetMeasurementIdArguments): void;
	gtag(...args: GoogleTagConsentArguments): void;
	gtag(...args: GoogleTagArguments): void {
		if (!this.#initialize) {
			throw new Error('Google Analytics is not initialized.');
		}
		if (this.#testMode || this.#isQueuing) {
			this.#queueGtag.push(args);
		} else {
			if (this.#someQueued) {
				this.#flushQueue();
			}
			this.#gtag(...args);
		}
	}

	initialize({ googleTagUrl, nonce, layer }: InitializeOptions = {}): void {
		if (this.#initialize) {
			return;
		}
		const defaultMeasurementId = this.defaultMeasurementId;
		if (!defaultMeasurementId) {
			throw new Error('No Google Analytics Measurement ID provided.');
		}
		this.#loadGoogleTag(defaultMeasurementId, googleTagUrl, nonce, layer);
		this.#initialize = true;
		if (this.#allowAdPersonalizationSignals === false) {
			this.gtag('set', 'allow_ad_personalization_signals', false);
		}
		this.gtag('js', new Date());
		this.#measurementId.forEach((params, measurementId) => {
			this.config(measurementId, params);
		});
	}

	set(params: GoogleTagSetParams): void;

	set(measurementID: GoogleTagMeasurementId, params: GoogleTagSetParams): void;

	set(measurementIdOrParams: GoogleTagMeasurementId | GoogleTagSetParams, params?: GoogleTagSetParams): void {
		if (typeof measurementIdOrParams === 'string' && params) {
			this.gtag('set', measurementIdOrParams, params);
		} else if (this.defaultMeasurementId && typeof measurementIdOrParams === 'object') {
			this.gtag('set', this.defaultMeasurementId, measurementIdOrParams);
		}
	}

	setTestMode(testMode: boolean): void {
		this.#testMode = testMode;
		this.#flushQueue();
	}

	#assertMeasurementId(value: unknown): value is GoogleTagMeasurementId {
		if (!this.#isGoogleTagMeasurementId(value)) {
			throw new TypeError(`Invalid Google Tag Measurement Id format. Expected '[G|GT|AW|DC]-XXXXXXXXXX'.`);
		}

		return true;
	}

	#flushQueue(): void {
		if (this.#isQueuing) {
			return;
		}
		if (this.#testMode) {
			return;
		}

		if (!this.#someQueued) {
			return;
		}

		while (this.#queueGtag.length > 0) {
			const args = this.#queueGtag.shift();
			if (args) {
				this.#gtag(...args);
			}
		}
	}

	#gtag(...args: GoogleTagArguments): void {
		if (typeof window === 'undefined') {
			return;
		}

		if (!('gtag' in window)) {
			return;
		}
		if (typeof window.gtag !== 'function') {
			return;
		}
		window.gtag(...args);
	}

	#isGoogleTagMeasurementId(value: unknown): value is GoogleTagMeasurementId {
		if (typeof value !== 'string') {
			return false;
		}

		return GOOGLE_TAG_MEASUREMENT_ID_REGEXP.test(value);
	}

	#loadGoogleTag(
		measurementID: GoogleTagMeasurementId,
		googleTagUrl = DEFAULT_GOOGLE_TAG_URL,
		nonce?: string,
		layer = 'dataLayer'
	): void {
		const exist = document.getElementById('google-tag-manager');
		if (exist) {
			return;
		}
		const script = document.createElement('script');
		script.async = true;
		script.id = 'google-tag-manager';
		script.src = `${googleTagUrl}?id=${measurementID}${layer === 'dataLayer' ? '' : `&l=${layer}`}`;
		if (nonce) {
			script.setAttribute('nonce', nonce);
		}
		document.head.appendChild(script);
		this.#loadGoogleTagLayer(layer);
	}

	#loadGoogleTagLayer(layer = 'dataLayer'): void {
		// @ts-expect-error Custom dataLayer
		if (!(layer in window) || typeof window[layer] === 'undefined') {
			// @ts-expect-error Custom dataLayer
			window[layer] = [];
		}

		if (!('gtag' in window) || typeof window.gtag === 'undefined') {
			window.gtag = function gtag(...args: unknown[]) {
				// @ts-expect-error Custom dataLayer
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
				window[layer].push(args);
			};
		}
	}
}

export type { GoogleTagOptions };

export default GoogleTag;
