/* eslint-disable @typescript-eslint/unified-signatures */

import format from './format';
import formatEmpty from './format.empty';
import gtag from './google-tag';
import type {
	ClientIdCallBack,
	CommandType,
	EventHitType,
	GoogleAnalyticsCommonOptions,
	GoogleAnalyticsEvent,
	GoogleAnalyticsFullOptions,
	GoogleAnalyticsGlobalOptions,
	GoogleAnalyticsOptions,
	GtagOptions,
	HitType,
	HitTypes,
	NonHitTypeObject,
	PageViewHitType,
	TimingHitType,
} from './types';
import { HIT_TYPES_ALLOWED_VALUES } from './types';

class GoogleAnalytics {
	readonly #defaultTrackingId: string;
	readonly #format: typeof format;
	#isQueuing: boolean;
	#options: GoogleAnalyticsGlobalOptions = {
		gtagUrl: 'https://www.googletagmanager.com/gtag/js',
		testMode: false,
	};

	readonly #queueGtag: unknown[][];
	readonly #trackingIds: Map<string, GtagOptions>;

	constructor(fullOptions: GoogleAnalyticsFullOptions);
	constructor(multipleFullOptions: GoogleAnalyticsFullOptions[]);
	constructor(trackingId: string, commonOptions?: GoogleAnalyticsCommonOptions);
	constructor(trackingId: (string | GoogleAnalyticsOptions)[], commonOptions?: GoogleAnalyticsCommonOptions);

	constructor(
		trackingIdWithOptions:
			| string
			| (string | GoogleAnalyticsOptions)[]
			| GoogleAnalyticsFullOptions
			| GoogleAnalyticsFullOptions[],
		options?: GoogleAnalyticsCommonOptions
	) {
		if (typeof window === 'undefined' || typeof document === 'undefined') {
			throw new Error(`'GoogleAnalytics' is only available in the browser.`);
		}
		this.#trackingIds = new Map();
		if (typeof trackingIdWithOptions === 'string') {
			const merged = {
				...this.#toGtagOptions(options?.gaOptions),
				...options?.gtagOptions,
			};
			this.#trackingIds.set(trackingIdWithOptions, merged);
			this.#options = { ...this.#options, ...options };
		} else if (typeof trackingIdWithOptions === 'object' && !Array.isArray(trackingIdWithOptions)) {
			if ('trackingId' in trackingIdWithOptions) {
				const { trackingId, gaOptions, gtagOptions, ...rest } = trackingIdWithOptions;
				const merged = {
					...this.#toGtagOptions(gaOptions),
					...gtagOptions,
				};
				this.#trackingIds.set(trackingId, merged);
				this.#options = { ...this.#options, ...rest };
			}
		} else if (Array.isArray(trackingIdWithOptions)) {
			for (const trackingIdWithOption of trackingIdWithOptions) {
				if (typeof trackingIdWithOption === 'string') {
					const gtagOptions = {
						...this.#toGtagOptions(options?.gaOptions),
						...options?.gtagOptions,
					};
					this.#trackingIds.set(trackingIdWithOption, gtagOptions);
				} else if (typeof trackingIdWithOption === 'object') {
					if ('trackingId' in trackingIdWithOption) {
						const { trackingId, ...rest } = trackingIdWithOption;
						const gtagOptions = {
							...this.#toGtagOptions({ ...rest.gaOptions, ...options?.gaOptions }),
							...rest.gtagOptions,
							...options?.gtagOptions,
						};
						this.#trackingIds.set(trackingId, gtagOptions);
					}
				}
			}
			this.#options = { ...this.#options, ...options };
		}
		if (this.#trackingIds.size === 0) {
			throw new Error(`'GA_MEASUREMENT_ID' is required.`);
		}
		this.#defaultTrackingId = this.#trackingIds.keys().next().value as string;
		this.#isQueuing = false;
		this.#queueGtag = [];
		this.#format = this.#options.titleCase ? format : formatEmpty;
		this.#initialize();
	}

	get testMode(): boolean {
		return this.#options.testMode;
	}

	event(event: GoogleAnalyticsEvent): void;
	event(eventName: string, args: object): void;
	event(eventOrEventName: string | GoogleAnalyticsEvent, args?: object): void {
		if (typeof eventOrEventName === 'string') {
			this.gtag('event', eventOrEventName, this.#toGtagOptions(args));
		} else if (this.#assertGoogleAnalyticsEvent(eventOrEventName)) {
			const eventHitType = {
				hitType: 'event',
				eventCategory: this.#format(eventOrEventName.category),
				eventAction: this.#format(eventOrEventName.action),
				...(eventOrEventName.label && { eventLabel: this.#format(eventOrEventName.label) }),
				...(eventOrEventName.nonInteraction && { non_interaction: eventOrEventName.nonInteraction }),
				...(eventOrEventName.transport && { transport: eventOrEventName.transport }),
			} satisfies EventHitType;

			this.#gaCommand('send', eventHitType);
		}
	}

	ga(callback: ClientIdCallBack): void;
	ga(command: 'set', args: object): void;
	ga(command: 'set', key: string, value: object): void;
	ga(command: 'send', hitType: HitType): void;
	ga(commandOrCallBack: CommandType | ClientIdCallBack, hitTypeOrKey?: string | object, value?: object): void {
		if (typeof commandOrCallBack === 'string') {
			switch (commandOrCallBack) {
				case 'send':
					if (this.#assertHitType(hitTypeOrKey)) {
						this.#gaCommand(commandOrCallBack, hitTypeOrKey);
					}

					break;
				case 'set':
					if (typeof hitTypeOrKey === 'string') {
						if (value) {
							this.#gaCommand(commandOrCallBack, hitTypeOrKey, value);
						}
					} else if (hitTypeOrKey) {
						this.#gaCommand(commandOrCallBack, hitTypeOrKey);
					}
					break;
			}
		} else {
			this.gtag('get', this.#defaultTrackingId, 'client_id', (clientId: string) => {
				this.#isQueuing = false;
				const queues = this.#queueGtag;

				commandOrCallBack(clientId);

				while (queues.length) {
					const queue = queues.shift();
					if (!queue) {
						continue;
					}
					this.gtag(...queue);
				}
			});

			this.#isQueuing = true;
		}
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

	set(args: object): void;
	set(key: string, value: object): void;
	set(argsOrKey: string | object, value?: object): void {
		if (!argsOrKey) {
			throw new Error('`argsOrKey` is required in .set()');
		}

		if (typeof argsOrKey === 'object') {
			if (Object.keys(argsOrKey).length === 0) {
				throw new Error('empty `fieldsObject` given to .set()');
			}

			this.#gaCommand('set', argsOrKey);
		} else if (typeof argsOrKey === 'string') {
			if (!value) {
				throw new Error('`value` is required in .set()');
			}

			this.#gaCommand('set', argsOrKey, value);
		} else {
			throw new Error('`argsOrKey` must be an object or a string in .set()');
		}
	}

	#assertEventHitType(hitType: unknown): hitType is NonHitTypeObject<EventHitType> {
		if (!hitType) {
			throw new Error('`hitType` is required');
		}
		if (typeof hitType !== 'object') {
			throw new Error('`hitType` must be an object');
		}
		if (!('eventAction' in hitType)) {
			throw new Error('`eventAction` is required');
		}

		if (typeof hitType.eventAction !== 'string') {
			throw new Error('`eventAction` must be a string');
		}

		if (!('eventCategory' in hitType)) {
			throw new Error('`eventCategory` is required');
		}

		if (typeof hitType.eventCategory !== 'string') {
			throw new Error('`eventCategory` must be a string');
		}

		return true;
	}

	#assertGoogleAnalyticsEvent(event: unknown): event is GoogleAnalyticsEvent {
		if (!event) {
			throw new Error('`event` is required');
		}
		if (typeof event !== 'object') {
			throw new Error('`event` must be an object');
		}
		if (!('action' in event)) {
			throw new Error('`event.action` is required');
		}
		if (typeof event.action !== 'string') {
			throw new Error('`event.action` must be a string');
		}
		if (!('category' in event)) {
			throw new Error('`event.category` is required');
		}
		if (typeof event.category !== 'string') {
			throw new Error('`event.category` must be a string');
		}

		if ('label' in event && typeof event.label !== 'string') {
			throw new Error('`event.label` must be a string');
		}

		if ('value' in event && typeof event.value !== 'number') {
			throw new Error('`event.value` must be a number');
		}

		if ('nonInteraction' in event && typeof event.nonInteraction !== 'boolean') {
			throw new Error('`event.nonInteraction` must be a boolean');
		}

		if ('transport' in event && typeof event.transport !== 'string') {
			throw new Error('`event.nonInteraction` must be either one of these values: `beacon`, `xhr` or `image`');
		}

		if (
			'transport' in event &&
			typeof event.transport === 'string' &&
			!['beacon', 'xhr', 'image'].includes(event.transport)
		) {
			throw new Error('`event.nonInteraction` must be either one of these values: `beacon`, `xhr` or `image`');
		}

		return true;
	}

	#assertHitType(hitType: unknown): hitType is EventHitType {
		if (!hitType) {
			throw new Error('`hitType` is required');
		}
		if (typeof hitType !== 'object') {
			throw new Error('`hitType` must be an object');
		}

		if (!('hitType' in hitType)) {
			throw new Error('`hitType` is required');
		}

		if (!HIT_TYPES_ALLOWED_VALUES.includes(hitType.hitType as string)) {
			const expected = HIT_TYPES_ALLOWED_VALUES.map(a => `'${a}`).join(', ');
			throw new Error(`\`hitType\` must be equals to \`${expected}`);
		}

		return true;
	}

	#gaCommand(command: 'set', args: object): void;
	#gaCommand(command: 'set', key: string, value: object): void;
	#gaCommand(command: 'send', hitType: HitType): void;
	#gaCommand(command: CommandType, hitTypeOrKey: string | object, value?: object): void {
		switch (command) {
			case 'send':
				if (this.#assertHitType(hitTypeOrKey)) {
					this.#gaCommandSend(hitTypeOrKey);
				}
				break;
			case 'set':
				if (typeof hitTypeOrKey === 'string') {
					if (value) {
						this.#gaCommandSet(hitTypeOrKey, value);
					}
				} else {
					this.#gaCommandSet(hitTypeOrKey);
				}
				break;
		}
	}

	#gaCommandSend(hitType: 'timing', params: NonHitTypeObject<TimingHitType>): void;
	#gaCommandSend(hitType: 'pageview', params: NonHitTypeObject<PageViewHitType>): void;
	#gaCommandSend(hitType: 'event', params: NonHitTypeObject<EventHitType>): void;
	#gaCommandSend(hitType: HitType): void;
	#gaCommandSend(...args: [HitTypes | HitType, NonHitTypeObject?]): void {
		const hitType = typeof args[0] === 'string' ? args[0] : args[0].hitType;
		const params = typeof args[0] === 'string' ? args[1] : args[0];
		if (!params) {
			return;
		}

		switch (hitType) {
			case 'event':
				this.#gaCommandSendEventParameters(hitType, params);
				break;
			case 'pageview':
				this.#gaCommandSendPageViewParameters(hitType, params);
				break;
			case 'timing':
			case 'screenview':
			case 'transaction':
			case 'item':
			case 'social':
			case 'exception':
				throw new Error(`Unsupported send command: ${hitType}`);
		}
	}

	#gaCommandSendEvent({
		eventAction,
		eventCategory,
		eventLabel,
		eventValue,
		nonInteraction,
		hitType: _hitType,
		...rest
	}: NonHitTypeObject<EventHitType>) {
		this.gtag('event', eventAction, {
			event_category: eventCategory,
			event_label: eventLabel,
			...(eventValue ? { value: eventValue } : {}),
			...(nonInteraction ? { non_interaction: nonInteraction } : {}),
			...this.#toGtagOptions(rest),
		});
	}

	#gaCommandSendEventParameters(hitType: 'event', params: NonHitTypeObject<EventHitType>): void;

	#gaCommandSendEventParameters(hitType: EventHitType): void;

	#gaCommandSendEventParameters(...args: ['event' | EventHitType, NonHitTypeObject<EventHitType>?]): void {
		const [hitTypeOrEvent, params] = args;
		if (typeof hitTypeOrEvent === 'string') {
			if (params && this.#assertEventHitType(params)) {
				this.#gaCommandSendEvent(params);
			}
		} else {
			const { hitType: _hitType, ...rest } = hitTypeOrEvent;
			if (this.#assertEventHitType(rest)) {
				this.#gaCommandSendEvent(rest);
			}
		}
	}

	#gaCommandSendPageView({ page, title, location, hitType: _hitType, ...rest }: NonHitTypeObject<PageViewHitType>) {
		const params = {
			...(page ? { page_path: page } : {}),
			...(title ? { page_title: title } : {}),
			...(location ? { page_location: location } : {}),
			...rest,
		};
		if (Object.keys(params).length) {
			this.gtag('event', 'page_view', params);
		} else {
			this.gtag('event', 'page_view');
		}
	}

	#gaCommandSendPageViewParameters(hitType: 'pageview', params: NonHitTypeObject<PageViewHitType>): void;
	#gaCommandSendPageViewParameters(hitType: PageViewHitType): void;
	#gaCommandSendPageViewParameters(
		...args: ['pageview' | PageViewHitType, NonHitTypeObject<PageViewHitType>?]
	): void {
		const [hitTypeOrEvent, params] = args;
		if (typeof hitTypeOrEvent === 'string') {
			if (params) {
				this.#gaCommandSendPageView(params);
			}
		} else {
			const { hitType: _hitType, ...rest } = hitTypeOrEvent;
			this.#gaCommandSendPageView(rest);
		}
	}

	#gaCommandSet(args: object): void;
	#gaCommandSet(key: string, value: object): void;
	#gaCommandSet(keyOrArgs: string | object, value?: object): void {
		let newArgs = keyOrArgs;
		if (typeof newArgs === 'string') {
			newArgs = { [newArgs]: value };
		}
		this.gtag('set', this.#toGtagOptions(newArgs));
	}

	#initialize() {
		this.#loadGoogleTagManager();
		this.#initializeGoogleTagManager();
		this.#initializeQueue();
	}

	#initializeGoogleTagManager() {
		this.gtag('js', new Date());
		for (const [trackingId, gtagOptions] of this.#trackingIds) {
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
		const script = document.createElement('script');
		script.async = true;
		script.id = 'google-tag-manager';
		script.src = `${this.#options.gtagUrl}?id=${this.#defaultTrackingId}`;
		if (this.#options.nonce) {
			script.setAttribute('nonce', this.#options.nonce);
		}
		document.body.appendChild(script);
	}

	#toGtagOptions(gaOptions?: unknown): GtagOptions {
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
