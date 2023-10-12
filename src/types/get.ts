import type { GoogleAnalyticsMeasurementId } from './measurement-id';
import type { GoogleAnalyticsParamsPrimitives } from './params';

type GoogleAnalyticsGetCallback = (value?: GoogleAnalyticsParamsPrimitives) => void;

type GoogleAnalyticsGetArguments = ['get', GoogleAnalyticsMeasurementId, string, GoogleAnalyticsGetCallback];

export type { GoogleAnalyticsGetArguments, GoogleAnalyticsGetCallback };
