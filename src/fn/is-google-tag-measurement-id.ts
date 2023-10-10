import type { GoogleTagMeasurementId } from '../types';

const regex = /^G-[A-Z0-9]{10}$/;

export default function isGoogleTagMeasurementId(value: unknown): value is GoogleTagMeasurementId {
	if (typeof value !== 'string') {
		return false;
	}

	return regex.test(value);
}
