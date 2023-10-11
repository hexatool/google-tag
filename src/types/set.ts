import type { GoogleAnalyticsMeasurementId } from './measurement-id';
import type { GoogleAnalyticsCommonParams } from './params';

type GoogleAnalyticsSetParams = GoogleAnalyticsCommonParams;

type GoogleAnalyticsSetArguments = ['set', GoogleAnalyticsMeasurementId, GoogleAnalyticsSetParams];

export type { GoogleAnalyticsSetArguments, GoogleAnalyticsSetParams };
