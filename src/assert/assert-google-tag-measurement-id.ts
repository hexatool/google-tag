import isGoogleTagMeasurementId from '../fn/is-google-tag-measurement-id';
import type { GoogleTagMeasurementId } from '../types';

export default function assertGoogleTagMeasurementId(value: unknown): value is GoogleTagMeasurementId {
	if (!isGoogleTagMeasurementId(value)) {
		throw new TypeError(`Invalid Google Tag Measurement Id format. Expected 'G-XXXXXXXXXX'.`);
	}

	return true;
}
