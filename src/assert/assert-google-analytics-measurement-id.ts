import { isGoogleAnalyticsMeasurementId } from '../fn';
import type { GoogleAnalyticsMeasurementId } from '../types';

export default function assertGoogleAnalyticsMeasurementId(value: unknown): value is GoogleAnalyticsMeasurementId {
	if (!isGoogleAnalyticsMeasurementId(value)) {
		throw new TypeError(`Invalid Google Tag Measurement Id format. Expected 'G-XXXXXXXXXX'.`);
	}

	return true;
}
