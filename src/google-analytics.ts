/* eslint-disable @typescript-eslint/unified-signatures */

import gtag from './google-tag';
import type {
	CommandType,
	GaOptions,
	GoogleAnalyticsCommonOptions,
	GoogleAnalyticsFullOptions,
	GoogleAnalyticsGlobalOptions,
	GoogleAnalyticsOptions,
	GtagOptions,
} from './types';

class GoogleAnalytics {
	#isQueuing: boolean;
	#options: GoogleAnalyticsGlobalOptions = {
		gtagUrl: 'https://www.googletagmanager.com/gtag/js',
		testMode: false,
	};

	readonly #queueGtag: unknown[][];
	readonly #trackingId: Map<string, GtagOptions>;

	constructor(fullOptions: GoogleAnalyticsFullOptions);
	constructor(multipleFullOptions: GoogleAnalyticsFullOptions[]);
	constructor(trackingId: string, commonOptions?: GoogleAnalyticsCommonOptions);
	constructor(trackingId: string[], commonOptions?: GoogleAnalyticsCommonOptions);
	constructor(trackingIdOptions: GoogleAnalyticsOptions[], commonOptions?: GoogleAnalyticsCommonOptions);

	constructor(
		trackingIdWithOptions:
			| string
			| string[]
			| GoogleAnalyticsOptions[]
			| GoogleAnalyticsFullOptions
			| GoogleAnalyticsFullOptions[],
		options?: GoogleAnalyticsCommonOptions
	) {
		if (typeof window === 'undefined' || typeof document === 'undefined') {
			throw new Error(`'GoogleAnalytics' is only available in the browser.`);
		}
		this.#trackingId = new Map();
		if (typeof trackingIdWithOptions === 'string') {
			const merged = {
				...this.#toGtagOptions(options?.gaOptions),
				...options?.gtagOptions,
			};
			this.#trackingId.set(trackingIdWithOptions, merged);
			this.#options = { ...this.#options, ...options };
		} else if (typeof trackingIdWithOptions === 'object' && !Array.isArray(trackingIdWithOptions)) {
			if ('trackingId' in trackingIdWithOptions) {
				const { trackingId, gaOptions, gtagOptions, ...rest } = trackingIdWithOptions;
				const merged = {
					...this.#toGtagOptions(gaOptions),
					...gtagOptions,
				};
				this.#trackingId.set(trackingId, merged);
				this.#options = { ...this.#options, ...rest };
			}
		} else if (Array.isArray(trackingIdWithOptions)) {
			for (const trackingIdWithOption of trackingIdWithOptions) {
				if (typeof trackingIdWithOption === 'string') {
					const gtagOptions = {
						...this.#toGtagOptions(options?.gaOptions),
						...options?.gtagOptions,
					};
					this.#trackingId.set(trackingIdWithOption, gtagOptions);
				} else if (typeof trackingIdWithOption === 'object') {
					if ('trackingId' in trackingIdWithOption) {
						const { trackingId, ...rest } = trackingIdWithOption;
						const gtagOptions = {
							...this.#toGtagOptions({ ...rest, ...options?.gaOptions }),
							...options?.gtagOptions,
						};
						this.#trackingId.set(trackingId, gtagOptions);
					}
				}
			}
			this.#options = { ...this.#options, ...options };
		}
		if (this.#trackingId.size === 0) {
			throw new Error(`'GA_MEASUREMENT_ID' is required.`);
		}
		this.#isQueuing = false;
		this.#queueGtag = [];
		this.#initialize();
	}

	get testMode(): boolean {
		return this.#options.testMode;
	}

	ga(_command: CommandType, ..._args: unknown[]): void {
		// Empty
	}

	gtag(...args: unknown[]): void {
		if (this.testMode) {
			this.#queueGtag.push(args);
		} else if (this.#isQueuing) {
			this.#queueGtag.push(args);
		} else {
			gtag(...args);
		}
	}

	#initialize() {
		this.#loadGoogleTagManager();
		this.#initializeGoogleTagManager();
		this.#initializeQueue();
	}

	#initializeGoogleTagManager() {
		this.gtag('js', new Date());
		for (const [trackingId, gtagOptions] of this.#trackingId) {
			if (Object.keys(gtagOptions).length) {
				this.gtag('config', trackingId, gtagOptions);
			} else {
				this.gtag('config', trackingId);
			}
		}
	}

	#initializeQueue() {
		if (this.testMode) {
			return;
		}
		const queues = [...this.#queueGtag];
		while (queues.length) {
			const queue = queues.shift();
			if (!queue) {
				continue;
			}
			this.gtag(...queue);
			if (queue[0] === 'get') {
				this.#isQueuing = true;
			}
		}
	}

	#loadGoogleTagManager() {
		if (this.testMode) {
			return;
		}
		const exist = document.getElementById('google-tag-manager');
		if (exist) {
			return;
		}
		const firstTrackingId = this.#trackingId.keys().next().value as string;
		const script = document.createElement('script');
		script.async = true;
		script.id = 'google-tag-manager';
		script.src = `${this.#options.gtagUrl}?id=${firstTrackingId}`;
		if (this.#options.nonce) {
			script.setAttribute('nonce', this.#options.nonce);
		}
		document.body.appendChild(script);
	}

	#toGtagOptions(gaOptions?: GaOptions): GtagOptions {
		if (!gaOptions) {
			return {};
		}

		const mapFields: Record<string, string> = {
			/*
			 * Old https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference#cookieUpdate
			 * New https://developers.google.com/analytics/devguides/collection/gtagjs/cookies-user-id#cookie_update
			 */
			cookieUpdate: 'cookie_update',
			cookieExpires: 'cookie_expires',
			cookieDomain: 'cookie_domain',
			// Must be in set method?
			cookieFlags: 'cookie_flags',
			userId: 'user_id',
			clientId: 'client_id',
			anonymizeIp: 'anonymize_ip',
			// https://support.google.com/analytics/answer/2853546?hl=en#zippy=%2Cin-this-article
			contentGroup1: 'content_group1',
			contentGroup2: 'content_group2',
			contentGroup3: 'content_group3',
			contentGroup4: 'content_group4',
			contentGroup5: 'content_group5',
			// https://support.google.com/analytics/answer/9050852?hl=en
			allowAdFeatures: 'allow_google_signals',
			allowAdPersonalizationSignals: 'allow_ad_personalization_signals',
			nonInteraction: 'non_interaction',
			page: 'page_path',
			hitCallback: 'event_callback',
		};

		return Object.entries(gaOptions).reduce<GtagOptions>((prev, [key, value]) => {
			const newKey = mapFields[key];
			if (newKey) {
				prev[newKey] = value;
			} else {
				prev[key] = value;
			}

			return prev;
		}, {});
	}
}

export default GoogleAnalytics;
