import type { GoogleAnalyticsArgumentsTyped } from '../arguments';
import type { GoogleAnalyticsEventCommonParams } from './params';

interface GoogleAnalyticsPageViewEventParams extends GoogleAnalyticsEventCommonParams {
	client_id?: string;
	language?: string;
	page_encoding?: string;
	page_location?: string;
	page_title?: string;
	user_agent?: string;
}

type GoogleAnalyticsPageViewEventArguments = GoogleAnalyticsArgumentsTyped<
	'event',
	'page_view',
	GoogleAnalyticsPageViewEventParams
>;

export type { GoogleAnalyticsPageViewEventArguments, GoogleAnalyticsPageViewEventParams };
