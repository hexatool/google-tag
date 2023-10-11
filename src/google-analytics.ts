import assertMeasurementId from './assert/assert-google-analytics-measurement-id';
import { isGoogleAnalyticsMeasurementId, loadGoogleAnalytics } from './fn';
import gtag from './google-tag';
import type {
	GoogleAnalyticsArguments,
	GoogleAnalyticsConfigArguments,
	GoogleAnalyticsConfigParams,
	GoogleAnalyticsCustomEventArguments,
	GoogleAnalyticsEvent,
	GoogleAnalyticsEventCommonParams,
	GoogleAnalyticsExceptionEventArguments,
	GoogleAnalyticsExceptionEventParams,
	GoogleAnalyticsGetArguments,
	GoogleAnalyticsGetCallback,
	GoogleAnalyticsLoginEventArguments,
	GoogleAnalyticsLoginEventParams,
	GoogleAnalyticsMeasurementId,
	GoogleAnalyticsPageViewEventArguments,
	GoogleAnalyticsPageViewEventParams,
} from './types';

interface GoogleAnalyticsOptions {
	measurementId?: GoogleAnalyticsMeasurementId | GoogleAnalyticsMeasurementId[];
	testMode?: boolean;
}

class GoogleAnalytics {
	#initialize: boolean;
	readonly #isQueuing: boolean;
	readonly #measurementId: Set<GoogleAnalyticsMeasurementId>;
	readonly #queueGtag: GoogleAnalyticsArguments[];
	#testMode: boolean;

	constructor(...measurementIds: GoogleAnalyticsMeasurementId[]);
	constructor(options: GoogleAnalyticsOptions);
	constructor(...args: [GoogleAnalyticsOptions | GoogleAnalyticsMeasurementId, ...GoogleAnalyticsMeasurementId[]]) {
		if (typeof window === 'undefined' || typeof document === 'undefined') {
			throw new Error(`'GoogleAnalytics' is only available in the browser.`);
		}
		const [first, ...rest] = args;
		this.#measurementId = new Set();
		this.#queueGtag = [];
		this.#testMode = false;
		this.#isQueuing = false;
		this.#initialize = false;
		if (typeof first === 'string') {
			this.addMeasurementId(first, ...rest);
		} else if (typeof first === 'object') {
			const { measurementId, testMode = false } = first;
			this.#testMode = testMode;
			if (typeof measurementId === 'string') {
				this.addMeasurementId(measurementId);
			} else if (Array.isArray(measurementId)) {
				this.addMeasurementId(...measurementId);
			}
		}
		this.#measurementId.forEach(assertMeasurementId);
	}

	get defaultMeasurementId(): GoogleAnalyticsMeasurementId | undefined {
		return this.#measurementId.values().next().value as GoogleAnalyticsMeasurementId | undefined;
	}

	get measurementIds(): GoogleAnalyticsMeasurementId[] {
		return Array.from(this.#measurementId);
	}

	get #someQueued(): boolean {
		return this.#queueGtag.length > 0;
	}

	addMeasurementId(...measurementId: GoogleAnalyticsMeasurementId[]): void {
		for (const id of measurementId) {
			if (assertMeasurementId(id)) {
				this.#measurementId.add(id);
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
			this.gtag('config', measurementIdOrParams, params);
		} else if (this.defaultMeasurementId && typeof measurementIdOrParams === 'object') {
			this.gtag('config', this.defaultMeasurementId, measurementIdOrParams);
		}
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

	gtag(...args: GoogleAnalyticsPageViewEventArguments): void;
	gtag(...args: GoogleAnalyticsExceptionEventArguments): void;
	gtag(...args: GoogleAnalyticsLoginEventArguments): void;
	gtag(...args: GoogleAnalyticsCustomEventArguments): void;
	gtag(...args: GoogleAnalyticsConfigArguments): void;
	gtag(...args: GoogleAnalyticsGetArguments): void;
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
			gtag(...args);
		}
	}

	initialize(googleTagUrl?: string, nonce?: string): void {
		if (this.#initialize) {
			return;
		}
		const defaultMeasurementId = this.defaultMeasurementId;
		if (!defaultMeasurementId) {
			throw new Error('No Google Analytics Measurement ID provided.');
		}
		loadGoogleAnalytics(defaultMeasurementId, googleTagUrl, nonce);
		this.#initialize = true;
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
				gtag(...args);
			}
		}
	}
}

export default GoogleAnalytics;
