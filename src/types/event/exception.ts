import type { GoogleAnalyticsArgumentsTyped } from '../arguments';
import type { GoogleAnalyticsEventCommonParams } from './params';

interface GoogleAnalyticsExceptionEventParams extends GoogleAnalyticsEventCommonParams {
	description?: string;
	fatal?: boolean;
}

type GoogleAnalyticsExceptionEventArguments = GoogleAnalyticsArgumentsTyped<
	'event',
	'exception',
	GoogleAnalyticsExceptionEventParams
>;

export type { GoogleAnalyticsExceptionEventArguments, GoogleAnalyticsExceptionEventParams };
