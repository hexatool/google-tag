import type { GoogleTagArgumentsTyped } from '../arguments';
import type { GoogleTagEventCommonParams } from './params';

interface GoogleTagCustomEventParams extends GoogleTagEventCommonParams {
	event_category?: string;
	event_label?: string;
	value?: number;
}

type GoogleTagCustomEventArguments = GoogleTagArgumentsTyped<'event', string, GoogleTagCustomEventParams>;

export type { GoogleTagCustomEventArguments, GoogleTagCustomEventParams };
