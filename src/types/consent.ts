import type { GoogleAnalyticsParams } from './params';

interface GoogleAnalyticsConsentParams extends GoogleAnalyticsParams {
	ad_storage?: 'denied' | 'granted';
	analytics_storage?: 'denied' | 'granted';
	wait_for_update?: number;
}

type GoogleAnalyticsConsentArguments = ['consent', GoogleAnalyticsConsentParams];

export type { GoogleAnalyticsConsentArguments, GoogleAnalyticsConsentParams };
