import type { GoogleAnalyticsMeasurementId } from './measurement-id';

type GoogleAnalyticsParamsPrimitives = string | number | boolean;
type GoogleAnalyticsParamsPrimitivesWithCallback = GoogleAnalyticsParamsPrimitives | ((...args: unknown[]) => void);

type GoogleAnalyticsParams = Record<
	string,
	GoogleAnalyticsParamsPrimitivesWithCallback | GoogleAnalyticsParamsPrimitivesWithCallback[]
>;

interface GoogleAnalyticsCommonParams extends GoogleAnalyticsParams {
	event_callback?: () => void;
	event_timeout?: number;
	groups?: string | string[];
	send_to?: GoogleAnalyticsMeasurementId | GoogleAnalyticsMeasurementId[];
}

export type {
	GoogleAnalyticsCommonParams,
	GoogleAnalyticsParams,
	GoogleAnalyticsParamsPrimitives,
	GoogleAnalyticsParamsPrimitivesWithCallback,
};
