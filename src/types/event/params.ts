import type { GoogleAnalyticsCommonParams } from '../params';

export interface GoogleAnalyticsEventCommonParams extends GoogleAnalyticsCommonParams {
	non_interaction?: boolean;
}
