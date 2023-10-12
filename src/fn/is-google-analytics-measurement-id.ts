import type { GoogleAnalyticsMeasurementId } from '../types';

const regex = /^G-[A-Z0-9]{10}$/;

export default function isGoogleAnalyticsMeasurementId(value: unknown): value is GoogleAnalyticsMeasurementId {
	if (typeof value !== 'string') {
		return false;
	}

	return regex.test(value);
}
