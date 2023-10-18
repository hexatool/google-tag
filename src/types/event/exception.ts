import type { GoogleTagArgumentsTyped } from '../arguments';
import type { GoogleTagEventCommonParams } from './params';

interface GoogleTagExceptionEventParams extends GoogleTagEventCommonParams {
	description?: string;
	fatal?: boolean;
}

type GoogleTagExceptionEventArguments = GoogleTagArgumentsTyped<'event', 'exception', GoogleTagExceptionEventParams>;

export type { GoogleTagExceptionEventArguments, GoogleTagExceptionEventParams };
