import type { GoogleTagArgumentsTyped } from './arguments';
import type { GoogleTagMeasurementId } from './measurement-id';

interface GoogleAnalyticsConfig {
	allow_ad_personalization_signals?: boolean;
	allow_google_signals?: boolean;
	campaign_content?: string;
	campaign_id?: string;
	campaign_medium?: string;
	campaign_name?: string;
	campaign_source?: string;
	campaign_term?: string;
	client_id?: string;
	content_group?: string;
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

type GoogleTagConfigArguments = GoogleTagArgumentsTyped<'config', GoogleTagMeasurementId, GoogleAnalyticsConfig>;

export type { GoogleAnalyticsConfig, GoogleTagConfigArguments };
