import type { GoogleAnalyticsMeasurementId } from '../measurement-id';
import type { GoogleAnalyticsParams } from '../params';

export interface GoogleAnalyticsEventCommonParams extends GoogleAnalyticsParams {
	event_callback?: () => void;
	event_timeout?: number;
	groups?: string | string[];
	non_interaction?: boolean;
	send_to?: GoogleAnalyticsMeasurementId | GoogleAnalyticsMeasurementId[];
}
