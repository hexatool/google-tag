import type { GoogleAnalyticsMeasurementId } from './measurement-id';
import type { GoogleAnalyticsParamsPrimitives } from './params';

type GoogleAnalyticsSetParams = Record<string, GoogleAnalyticsParamsPrimitives>;

type GoogleAnalyticsSetArguments = ['set', GoogleAnalyticsMeasurementId, GoogleAnalyticsSetParams];

export type { GoogleAnalyticsSetArguments, GoogleAnalyticsSetParams };
