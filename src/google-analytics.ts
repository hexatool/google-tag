import assertMeasurementId from './assert/assert-google-analytics-measurement-id';
import { isGoogleAnalyticsMeasurementId, loadGoogleAnalytics } from './fn';
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
	GoogleAnalyticsMeasurementId,
	GoogleAnalyticsPageViewEventArguments,
	GoogleAnalyticsPageViewEventParams,
	GoogleAnalyticsSetArguments,
	GoogleAnalyticsSetMeasurementIdArguments,
	GoogleAnalyticsSetParams,
	InitializeOptions,
} from './types';

interface GoogleAnalyticsConfigParamsWithMeasurementId extends GoogleAnalyticsConfigParams {
	measurementId: GoogleAnalyticsMeasurementId;
}

interface GoogleAnalyticsOptions {
	allowAdPersonalizationSignals?: false;
	measurementId?:
		| GoogleAnalyticsMeasurementId
		| GoogleAnalyticsConfigParamsWithMeasurementId
		| (GoogleAnalyticsMeasurementId | GoogleAnalyticsConfigParamsWithMeasurementId)[];
	testMode?: boolean;
}

class GoogleAnalytics {
	readonly #allowAdPersonalizationSignals?: false;
	#initialize: boolean;
	readonly #isQueuing: boolean;
	readonly #measurementId: Map<GoogleAnalyticsMeasurementId, GoogleAnalyticsConfigParams>;
	readonly #queueGtag: GoogleAnalyticsArguments[];
	#testMode: boolean;

	constructor(...measurementIds: GoogleAnalyticsMeasurementId[]);
	constructor(options: GoogleAnalyticsOptions);
	constructor(...args: [GoogleAnalyticsOptions | GoogleAnalyticsMeasurementId, ...GoogleAnalyticsMeasurementId[]]) {
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
		this.measurementIds.forEach(assertMeasurementId);
	}

	get defaultMeasurementId(): GoogleAnalyticsMeasurementId | undefined {
		return this.measurementIds[0];
	}

	get measurementIds(): GoogleAnalyticsMeasurementId[] {
		return Array.from(this.#measurementId.keys());
	}

	get #someQueued(): boolean {
		return this.#queueGtag.length > 0;
	}

	addMeasurementId(
		...measurementId: (GoogleAnalyticsMeasurementId | GoogleAnalyticsConfigParamsWithMeasurementId)[]
	): void {
		for (const id of measurementId) {
			if (typeof id === 'string' && assertMeasurementId(id)) {
				this.#measurementId.set(id, {});
			} else if (typeof id === 'object' && assertMeasurementId(id.measurementId)) {
				const { measurementId: _, ...rest } = id;
				this.#measurementId.set(id.measurementId, rest);
			}
		}
	}

	config(params: GoogleAnalyticsConfigParams): void;
	config(measurementID: GoogleAnalyticsMeasurementId, params?: GoogleAnalyticsConfigParams): void;
	config(
		measurementIdOrParams: GoogleAnalyticsMeasurementId | GoogleAnalyticsConfigParams,
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
	get(measurementID: GoogleAnalyticsMeasurementId, field: string, callback: GoogleAnalyticsGetCallback): void;
	get(
		fieldOrMeasurementID: string,
		fieldOrCallBack: string | GoogleAnalyticsGetCallback,
		callback?: GoogleAnalyticsGetCallback
	): void {
		if (isGoogleAnalyticsMeasurementId(fieldOrMeasurementID) && typeof fieldOrCallBack === 'string' && callback) {
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
		loadGoogleAnalytics(defaultMeasurementId, googleTagUrl, nonce, layer);
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

	set(measurementID: GoogleAnalyticsMeasurementId, params: GoogleAnalyticsSetParams): void;

	set(
		measurementIdOrParams: GoogleAnalyticsMeasurementId | GoogleAnalyticsSetParams,
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
}

export type { GoogleAnalyticsOptions };

export default GoogleAnalytics;
