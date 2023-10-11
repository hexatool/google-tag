import type { GoogleAnalyticsEventArgumentsTyped } from './event';
import type { GoogleAnalyticsMeasurementId } from './measurement-id';

interface GoogleAnalyticsConfigParams {
	groups?: string | string[];
	send_page_view?: boolean;
}

type GoogleAnalyticsConfigArguments = GoogleAnalyticsEventArgumentsTyped<
	'config',
	GoogleAnalyticsMeasurementId,
	GoogleAnalyticsConfigParams
>;

export type { GoogleAnalyticsConfigArguments, GoogleAnalyticsConfigParams };
