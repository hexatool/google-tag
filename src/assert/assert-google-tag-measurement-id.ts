import { isGoogleTagMeasurementId } from '../fn';
import type { GoogleTagMeasurementId } from '../types';

export default function assertGoogleTagMeasurementId(value: unknown): value is GoogleTagMeasurementId {
	if (!isGoogleTagMeasurementId(value)) {
		throw new TypeError(`Invalid Google Tag Measurement Id format. Expected '[G|GT|AW|DC]-XXXXXXXXXX'.`);
	}

	return true;
}
