interface GaOptions {
	[key: string]: unknown;
	allowAdFeatures?: boolean;
	allowAdPersonalizationSignals?: boolean;
	anonymizeIp?: boolean;
	clientId?: string;
	contentGroup1?: string;
	contentGroup2?: string;
	contentGroup3?: string;
	contentGroup4?: string;
	contentGroup5?: string;
	cookieDomain?: string;
	cookieExpires?: number;
	cookieFlags?: string;
	cookieUpdate?: boolean;
	hitCallback?: () => void;
	nonInteraction?: boolean;
	page?: string;
	userId?: string;
}

interface GtagOptions {
	[key: string]: unknown;
	allow_ad_personalization_signals?: boolean;
	allow_google_signals?: boolean;
	anonymize_ip?: boolean;
	client_id?: string;
	content_group1?: string;
	content_group2?: string;
	content_group3?: string;
	content_group4?: string;
	content_group5?: string;
	cookie_domain?: string;
	cookie_expires?: number;
	cookie_flags?: string;
	cookie_update?: boolean;
	event_callback?: () => void;
	non_interaction?: boolean;
	page_path?: string;
	user_id?: string;
}

interface GoogleTagsOptions {
	gaOptions?: GaOptions;
	gtagOptions?: GtagOptions;
}

interface GoogleAnalyticsGlobalOptions {
	gtagUrl: string;
	nonce?: string;
	testMode: boolean;
}

interface GoogleAnalyticsWithTrackingOptions {
	trackingId: string;
}

type GoogleAnalyticsCommonOptions = Partial<GoogleAnalyticsGlobalOptions & GoogleTagsOptions>;
type GoogleAnalyticsFullOptions = GoogleAnalyticsWithTrackingOptions &
	Partial<GoogleAnalyticsGlobalOptions & GoogleTagsOptions>;

type GoogleAnalyticsOptions = GoogleAnalyticsWithTrackingOptions & GoogleTagsOptions;

type CommandType = 'send';
type HitTypes = 'event' | 'pageview' | 'screenview' | 'transaction' | 'item' | 'social' | 'exception' | 'timing';

interface HitTypeObject {
	hitType: HitTypes;
}

type NonHitTypeObject<T> = Omit<T, keyof HitTypeObject>;

export type {
	CommandType,
	GaOptions,
	GoogleAnalyticsCommonOptions,
	GoogleAnalyticsFullOptions,
	GoogleAnalyticsGlobalOptions,
	GoogleAnalyticsOptions,
	GtagOptions,
	HitTypeObject,
	HitTypes,
	NonHitTypeObject,
};
