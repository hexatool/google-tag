import assertGoogleTagMeasurementId from './assert/assert-google-tag-measurement-id';
import loadGoogleTagManager from './fn/load-google-tag';
import type { GoogleTagMeasurementId } from './types';

interface GoogleAnalyticsOptions {
	measurementId?: GoogleTagMeasurementId | GoogleTagMeasurementId[];
}

class GoogleAnalytics {
	readonly #measurementId: Set<GoogleTagMeasurementId>;
	readonly #testMode: boolean = false;

	constructor(...measurementIds: GoogleTagMeasurementId[]);
	constructor(options: GoogleAnalyticsOptions);
	constructor(...args: [GoogleAnalyticsOptions | GoogleTagMeasurementId, ...GoogleTagMeasurementId[]]) {
		if (typeof window === 'undefined' || typeof document === 'undefined') {
			throw new Error(`'GoogleAnalytics' is only available in the browser.`);
		}
		const [first, ...rest] = args;
		this.#measurementId = new Set();
		if (typeof first === 'string') {
			this.addMeasurementId(first, ...rest);
		} else if (typeof first === 'object') {
			const { measurementId } = first;
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

	addMeasurementId(...measurementId: GoogleTagMeasurementId[]): void {
		for (const id of measurementId) {
			if (assertGoogleTagMeasurementId(id)) {
				this.#measurementId.add(id);
			}
		}
	}

	initialize(googleTagUrl?: string, nonce?: string): void {
		if (this.#testMode) {
			return;
		}
		const defaultMeasurementId = this.defaultMeasurementId;
		if (!defaultMeasurementId) {
			throw new Error('No Google Analytics Measurement ID provided.');
		}
		loadGoogleTagManager(defaultMeasurementId, googleTagUrl, nonce);
	}
}

export default GoogleAnalytics;
