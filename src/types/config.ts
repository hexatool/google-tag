import type { GoogleTagArgumentsTyped } from './arguments';
import type { GoogleTagMeasurementId } from './measurement-id';
import type { GoogleTagCommonParams } from './params';

interface GoogleTagConfigParams extends GoogleTagCommonParams {
	allow_ad_personalization_signals?: boolean;
	allow_google_signals?: boolean;
	cookie_domain?: string;
	cookie_expires?: number;
	cookie_prefix?: string;
	cookie_update?: false;
	page_location?: string;
	page_title?: string;
	restricted_data_processing?: boolean;
	send_page_view?: boolean;
	user_id?: string;
}

type GoogleTagConfigArguments = GoogleTagArgumentsTyped<'config', GoogleTagMeasurementId, GoogleTagConfigParams>;

export type { GoogleTagConfigArguments, GoogleTagConfigParams };
