import type { GoogleAnalyticsParamsWithCallback } from './params';

interface GoogleAnalyticsConsentParams extends GoogleAnalyticsParamsWithCallback {
	ad_storage?: 'denied' | 'granted';
	analytics_storage?: 'denied' | 'granted';
	region?: string[];
	wait_for_update?: number;
}

type GoogleAnalyticsConsentArguments = ['consent', GoogleAnalyticsConsentParams];

export type { GoogleAnalyticsConsentArguments, GoogleAnalyticsConsentParams };
