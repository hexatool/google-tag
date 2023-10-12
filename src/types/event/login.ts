import type { GoogleAnalyticsArgumentsTyped } from '../arguments';
import type { GoogleAnalyticsEventCommonParams } from './params';

interface GoogleAnalyticsLoginEventParams extends GoogleAnalyticsEventCommonParams {
	method?: string;
}

type GoogleAnalyticsLoginEventArguments = GoogleAnalyticsArgumentsTyped<
	'event',
	'login',
	GoogleAnalyticsLoginEventParams
>;

export type { GoogleAnalyticsLoginEventArguments, GoogleAnalyticsLoginEventParams };
