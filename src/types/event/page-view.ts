import type { GoogleTagArgumentsTyped } from '../arguments';
import type { GoogleTagEventCommonParams } from './params';

interface GoogleTagPageViewEventParams extends GoogleTagEventCommonParams {
	client_id?: string;
	language?: string;
	page_encoding?: string;
	page_location?: string;
	page_title?: string;
	user_agent?: string;
}

type GoogleTagPageViewEventArguments = GoogleTagArgumentsTyped<'event', 'page_view', GoogleTagPageViewEventParams>;

export type { GoogleTagPageViewEventArguments, GoogleTagPageViewEventParams };
