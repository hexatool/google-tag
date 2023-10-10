import assertGoogleTagMeasurementId from './assert/assert-google-tag-measurement-id';
import loadGoogleTagManager from './fn/load-google-tag';
import gtag from './google-tag';
import type { GoogleTagArguments, GoogleTagMeasurementId } from './types';

interface GoogleAnalyticsOptions {
	measurementId?: GoogleTagMeasurementId | GoogleTagMeasurementId[];
	testMode?: boolean;
}

class GoogleAnalytics {
	#initialize: boolean;
	readonly #isQueuing: boolean;
	readonly #measurementId: Set<GoogleTagMeasurementId>;
	readonly #queueGtag: GoogleTagArguments[];
	#testMode: boolean;

	constructor(...measurementIds: GoogleTagMeasurementId[]);
	constructor(options: GoogleAnalyticsOptions);
	constructor(...args: [GoogleAnalyticsOptions | GoogleTagMeasurementId, ...GoogleTagMeasurementId[]]) {
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
		this.#measurementId.forEach(assertGoogleTagMeasurementId);
	}

	get defaultMeasurementId(): GoogleTagMeasurementId | undefined {
		return this.#measurementId.values().next().value as GoogleTagMeasurementId | undefined;
	}

	get measurementIds(): GoogleTagMeasurementId[] {
		return Array.from(this.#measurementId);
	}

	get #someQueued(): boolean {
		return this.#queueGtag.length > 0;
	}

	addMeasurementId(...measurementId: GoogleTagMeasurementId[]): void {
		for (const id of measurementId) {
			if (assertGoogleTagMeasurementId(id)) {
				this.#measurementId.add(id);
			}
		}
	}

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
		loadGoogleTagManager(defaultMeasurementId, googleTagUrl, nonce);
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
