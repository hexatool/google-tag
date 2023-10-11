import type { GoogleAnalyticsEventArgumentsTyped } from './arguments';
import type { GoogleAnalyticsEventCommonParams } from './params';

interface GoogleAnalyticsExceptionEventParams extends GoogleAnalyticsEventCommonParams {
	description?: string;
	fatal?: boolean;
}

type GoogleAnalyticsExceptionEventArguments = GoogleAnalyticsEventArgumentsTyped<
	'event',
	'exception',
	GoogleAnalyticsExceptionEventParams
>;

export type { GoogleAnalyticsExceptionEventArguments, GoogleAnalyticsExceptionEventParams };
