import type { GoogleAnalyticsArgumentsTyped } from './arguments';
import type { GoogleAnalyticsMeasurementId } from './measurement-id';

interface GoogleAnalyticsConfigParams {
	groups?: string | string[];
	send_page_view?: boolean;
}

type GoogleAnalyticsConfigArguments = GoogleAnalyticsArgumentsTyped<
	'config',
	GoogleAnalyticsMeasurementId,
	GoogleAnalyticsConfigParams
>;

export type { GoogleAnalyticsConfigArguments, GoogleAnalyticsConfigParams };
