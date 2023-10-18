import type { GoogleTagArgumentsTyped } from '../arguments';
import type { GoogleTagEventCommonParams } from './params';

interface GoogleTagLoginEventParams extends GoogleTagEventCommonParams {
	method?: string;
}

type GoogleTagLoginEventArguments = GoogleTagArgumentsTyped<'event', 'login', GoogleTagLoginEventParams>;

export type { GoogleTagLoginEventArguments, GoogleTagLoginEventParams };
