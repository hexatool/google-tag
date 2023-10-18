import type { GoogleTagMeasurementId } from './measurement-id';
import type { GoogleAnalyticsParamsPrimitives } from './params';

type GoogleAnalyticsGetCallback = (value?: GoogleAnalyticsParamsPrimitives) => void;

type GoogleAnalyticsGetArguments = ['get', GoogleTagMeasurementId, string, GoogleAnalyticsGetCallback];

export type { GoogleAnalyticsGetArguments, GoogleAnalyticsGetCallback };
