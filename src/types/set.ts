import type { GoogleTagMeasurementId } from './measurement-id';
import type { GoogleTagParamsPrimitives, GoogleTagSetAndEventParams } from './params';

interface GoogleTagSetParams extends GoogleTagSetAndEventParams {
	allow_ad_personalization_signals?: boolean;
	allow_google_signals?: boolean;
	restricted_data_processing?: boolean;
	send_page_view?: boolean;
}

type GoogleTagSetMeasurementIdArguments = ['set', GoogleTagMeasurementId, GoogleTagSetParams];
type GoogleTagSetArguments = ['set', string, GoogleTagParamsPrimitives];

export type { GoogleTagSetArguments, GoogleTagSetMeasurementIdArguments, GoogleTagSetParams };
