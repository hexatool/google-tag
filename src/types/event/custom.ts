import type { GoogleAnalyticsEventArgumentsTyped } from './arguments';
import type { GoogleAnalyticsEventCommonParams } from './params';

interface GoogleAnalyticsCustomEventParams extends GoogleAnalyticsEventCommonParams {
	event_category?: string;
	event_label?: string;
	value?: number;
}

type GoogleAnalyticsCustomEventArguments = GoogleAnalyticsEventArgumentsTyped<
	'event',
	string,
	GoogleAnalyticsCustomEventParams
>;

export type { GoogleAnalyticsCustomEventArguments, GoogleAnalyticsCustomEventParams };
