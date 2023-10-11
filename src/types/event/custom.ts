import type { GoogleAnalyticsArgumentsTyped } from '../arguments';
import type { GoogleAnalyticsEventCommonParams } from './params';

interface GoogleAnalyticsCustomEventParams extends GoogleAnalyticsEventCommonParams {
	event_category?: string;
	event_label?: string;
	value?: number;
}

type GoogleAnalyticsCustomEventArguments = GoogleAnalyticsArgumentsTyped<
	'event',
	string,
	GoogleAnalyticsCustomEventParams
>;

export type { GoogleAnalyticsCustomEventArguments, GoogleAnalyticsCustomEventParams };
