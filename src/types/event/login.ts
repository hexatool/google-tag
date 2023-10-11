import type { GoogleAnalyticsEventArgumentsTyped } from './arguments';
import type { GoogleAnalyticsEventCommonParams } from './params';

interface GoogleAnalyticsLoginEventParams extends GoogleAnalyticsEventCommonParams {
	method?: string;
}

type GoogleAnalyticsLoginEventArguments = GoogleAnalyticsEventArgumentsTyped<
	'event',
	'login',
	GoogleAnalyticsLoginEventParams
>;

export type { GoogleAnalyticsLoginEventArguments, GoogleAnalyticsLoginEventParams };
