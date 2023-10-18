import type { GoogleTagMeasurementId } from './measurement-id';

type GoogleAnalyticsParamsPrimitives = string | number | boolean | undefined | null;
type GoogleAnalyticsParamsPrimitivesWithCallback = GoogleAnalyticsParamsPrimitives | ((...args: unknown[]) => void);

type GoogleAnalyticsParams = Record<string, GoogleAnalyticsParamsPrimitives | GoogleAnalyticsParamsPrimitives[]>;

type GoogleAnalyticsParamsWithCallback = Record<
	string,
	GoogleAnalyticsParamsPrimitivesWithCallback | GoogleAnalyticsParamsPrimitivesWithCallback[]
>;

interface GoogleAnalyticsCommonParams extends GoogleAnalyticsParamsWithCallback {
	event_callback?: () => void;
	event_timeout?: number;
	groups?: string | string[];
	send_to?: GoogleTagMeasurementId | GoogleTagMeasurementId[];
}

export type {
	GoogleAnalyticsCommonParams,
	GoogleAnalyticsParams,
	GoogleAnalyticsParamsPrimitives,
	GoogleAnalyticsParamsPrimitivesWithCallback,
	GoogleAnalyticsParamsWithCallback,
};
