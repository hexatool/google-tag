import type {
	GoogleAnalyticsArguments,
	GoogleAnalyticsConfigArguments,
	GoogleAnalyticsConfigParams,
	GoogleAnalyticsConsentArguments,
	GoogleAnalyticsConsentParams,
	GoogleAnalyticsCustomEventArguments,
	GoogleAnalyticsEvent,
	GoogleAnalyticsEventCommonParams,
	GoogleAnalyticsExceptionEventArguments,
	GoogleAnalyticsExceptionEventParams,
	GoogleAnalyticsGetArguments,
	GoogleAnalyticsGetCallback,
	GoogleAnalyticsJsArguments,
	GoogleAnalyticsLoginEventArguments,
	GoogleAnalyticsLoginEventParams,
	GoogleAnalyticsPageViewEventArguments,
	GoogleAnalyticsPageViewEventParams,
	GoogleAnalyticsSetArguments,
	GoogleAnalyticsSetMeasurementIdArguments,
	GoogleAnalyticsSetParams,
	GoogleTagMeasurementId,
	InitializeOptions,
} from './types';

interface GoogleAnalyticsConfigParamsWithMeasurementId extends GoogleAnalyticsConfigParams {
	measurementId: GoogleTagMeasurementId;
}

interface GoogleAnalyticsOptions {
	allowAdPersonalizationSignals?: false;
	measurementId?:
		| GoogleTagMeasurementId
		| GoogleAnalyticsConfigParamsWithMeasurementId
		| (GoogleTagMeasurementId | GoogleAnalyticsConfigParamsWithMeasurementId)[];
	testMode?: boolean;
}

const GOOGLE_TAG_MEASUREMENT_ID_REGEXP = /^(?:G|GT|AW|DC)-[A-Z0-9]{10}$/;
const DEFAULT_GOOGLE_TAG_URL = 'https://www.googletagmanager.com/gtag/js';

class GoogleAnalytics {
	readonly #allowAdPersonalizationSignals?: false;
	#initialize: boolean;
	readonly #isQueuing: boolean;
	readonly #measurementId: Map<GoogleTagMeasurementId, GoogleAnalyticsConfigParams>;
	readonly #queueGtag: GoogleAnalyticsArguments[];
	#testMode: boolean;

	constructor(...measurementIds: GoogleTagMeasurementId[]);
	constructor(options: GoogleAnalyticsOptions);
	constructor(...args: [GoogleAnalyticsOptions | GoogleTagMeasurementId, ...GoogleTagMeasurementId[]]) {
		if (typeof window === 'undefined' || typeof document === 'undefined') {
			throw new Error(`'GoogleAnalytics' is only available in the browser.`);
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

	addMeasurementId(
		...measurementId: (GoogleTagMeasurementId | GoogleAnalyticsConfigParamsWithMeasurementId)[]
	): void {
		for (const id of measurementId) {
			if (typeof id === 'string' && this.#assertMeasurementId(id)) {
				this.#measurementId.set(id, {});
			} else if (typeof id === 'object' && this.#assertMeasurementId(id.measurementId)) {
				const { measurementId: _, ...rest } = id;
				this.#measurementId.set(id.measurementId, rest);
			}
		}
	}

	config(params: GoogleAnalyticsConfigParams): void;
	config(measurementID: GoogleTagMeasurementId, params?: GoogleAnalyticsConfigParams): void;
	config(
		measurementIdOrParams: GoogleTagMeasurementId | GoogleAnalyticsConfigParams,
		params?: GoogleAnalyticsConfigParams
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

	consent(params: GoogleAnalyticsConsentParams): void {
		this.gtag('consent', params);
	}

	event(event: 'login', params?: GoogleAnalyticsLoginEventParams): void;
	event(event: 'exception', params?: GoogleAnalyticsExceptionEventParams): void;
	event(event: 'page_view', params?: GoogleAnalyticsPageViewEventParams): void;
	event(event: string, params?: GoogleAnalyticsEventCommonParams): void;
	event(event: GoogleAnalyticsEvent, params?: GoogleAnalyticsEventCommonParams): void {
		if (params) {
			this.gtag('event', event, params);
		} else {
			this.gtag('event', event);
		}
	}

	get(field: string, callback: GoogleAnalyticsGetCallback): void;
	get(measurementID: GoogleTagMeasurementId, field: string, callback: GoogleAnalyticsGetCallback): void;
	get(
		fieldOrMeasurementID: string,
		fieldOrCallBack: string | GoogleAnalyticsGetCallback,
		callback?: GoogleAnalyticsGetCallback
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

	gtag(...args: GoogleAnalyticsJsArguments): void;
	gtag(...args: GoogleAnalyticsPageViewEventArguments): void;
	gtag(...args: GoogleAnalyticsExceptionEventArguments): void;
	gtag(...args: GoogleAnalyticsLoginEventArguments): void;
	gtag(...args: GoogleAnalyticsCustomEventArguments): void;
	gtag(...args: GoogleAnalyticsConfigArguments): void;
	gtag(...args: GoogleAnalyticsGetArguments): void;
	gtag(...args: GoogleAnalyticsSetArguments): void;
	gtag(...args: GoogleAnalyticsSetMeasurementIdArguments): void;
	gtag(...args: GoogleAnalyticsConsentArguments): void;
	gtag(...args: GoogleAnalyticsArguments): void {
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
		this.#loadGoogleAnalytics(defaultMeasurementId, googleTagUrl, nonce, layer);
		this.#initialize = true;
		if (this.#allowAdPersonalizationSignals === false) {
			this.gtag('set', 'allow_ad_personalization_signals', false);
		}
		this.gtag('js', new Date());
		this.#measurementId.forEach((params, measurementId) => {
			this.config(measurementId, params);
		});
	}

	set(params: GoogleAnalyticsSetParams): void;

	set(measurementID: GoogleTagMeasurementId, params: GoogleAnalyticsSetParams): void;

	set(
		measurementIdOrParams: GoogleTagMeasurementId | GoogleAnalyticsSetParams,
		params?: GoogleAnalyticsSetParams
	): void {
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

	#gtag(...args: GoogleAnalyticsArguments): void {
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

	#loadGoogleAnalytics(
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

export type { GoogleAnalyticsOptions };

export default GoogleAnalytics;
