import type { GoogleAnalyticsArgumentsTyped } from './arguments';
import type { GoogleAnalyticsMeasurementId } from './measurement-id';
import type { GoogleAnalyticsCommonParams } from './params';

interface GoogleAnalyticsConfigParams extends GoogleAnalyticsCommonParams {
	page_location?: string;
	page_title?: string;
	send_page_view?: boolean;
	user_id?: string;
}

type GoogleAnalyticsConfigArguments = GoogleAnalyticsArgumentsTyped<
	'config',
	GoogleAnalyticsMeasurementId,
	GoogleAnalyticsConfigParams
>;

export type { GoogleAnalyticsConfigArguments, GoogleAnalyticsConfigParams };
