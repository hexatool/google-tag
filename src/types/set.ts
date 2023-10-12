import type { GoogleAnalyticsMeasurementId } from './measurement-id';
import type { GoogleAnalyticsCommonParams, GoogleAnalyticsParamsPrimitives } from './params';

interface GoogleAnalyticsSetParams extends GoogleAnalyticsCommonParams {
	allow_ad_personalization_signals?: boolean;
	allow_google_signals?: boolean;
	restricted_data_processing?: boolean;
	send_page_view?: boolean;
}

type GoogleAnalyticsSetMeasurementIdArguments = ['set', GoogleAnalyticsMeasurementId, GoogleAnalyticsSetParams];
type GoogleAnalyticsSetArguments = ['set', string, GoogleAnalyticsParamsPrimitives];

export type { GoogleAnalyticsSetArguments, GoogleAnalyticsSetMeasurementIdArguments, GoogleAnalyticsSetParams };
