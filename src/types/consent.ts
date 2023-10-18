import type { GoogleTagParamsWithCallback } from './params';

interface GoogleTagConsentParams extends GoogleTagParamsWithCallback {
	ad_storage?: 'denied' | 'granted';
	analytics_storage?: 'denied' | 'granted';
	region?: string[];
	wait_for_update?: number;
}

type GoogleTagConsentArguments = ['consent', GoogleTagConsentParams];

export type { GoogleTagConsentArguments, GoogleTagConsentParams };
