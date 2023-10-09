import type { GaOptions, GtagOptions } from './google-tag.options';

interface GoogleTagsOptions {
	gaOptions?: GaOptions;
	gtagOptions?: GtagOptions;
}

interface GoogleAnalyticsGlobalOptions {
	gtagUrl: string;
	nonce?: string;
	testMode: boolean;
	titleCase?: boolean;
}

interface GoogleAnalyticsWithTrackingOptions {
	trackingId: string;
}

type GoogleAnalyticsCommonOptions = Partial<GoogleAnalyticsGlobalOptions & GoogleTagsOptions>;
type GoogleAnalyticsFullOptions = GoogleAnalyticsWithTrackingOptions &
	Partial<GoogleAnalyticsGlobalOptions & GoogleTagsOptions>;

type GoogleAnalyticsOptions = GoogleAnalyticsWithTrackingOptions & GoogleTagsOptions;

export type {
	GoogleAnalyticsCommonOptions,
	GoogleAnalyticsFullOptions,
	GoogleAnalyticsGlobalOptions,
	GoogleAnalyticsOptions,
};
