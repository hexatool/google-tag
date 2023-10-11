import type { GoogleAnalyticsMeasurementId } from '../measurement-id';

type GoogleAnalyticsParamsPrimitives = string | number | boolean | (() => void);

type GoogleAnalyticsParams = Record<string, GoogleAnalyticsParamsPrimitives | GoogleAnalyticsParamsPrimitives[]>;

interface GoogleAnalyticsEventCommonParams extends GoogleAnalyticsParams {
	event_callback?: () => void;
	event_timeout?: number;
	groups?: string | string[];
	non_interaction?: boolean;
	send_to?: GoogleAnalyticsMeasurementId | GoogleAnalyticsMeasurementId[];
}

export type { GoogleAnalyticsEventCommonParams, GoogleAnalyticsParams, GoogleAnalyticsParamsPrimitives };
