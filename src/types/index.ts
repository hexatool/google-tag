import type { GoogleAnalyticsConfigArguments } from './config';
import type { GoogleAnalyticsConsentArguments } from './consent';
import type {
	GoogleAnalyticsCustomEventArguments,
	GoogleAnalyticsExceptionEventArguments,
	GoogleAnalyticsLoginEventArguments,
	GoogleAnalyticsPageViewEventArguments,
} from './event';
import type { GoogleAnalyticsGetArguments } from './get';
import type { GoogleAnalyticsJsArguments } from './js';
import type { GoogleAnalyticsSetArguments } from './set';

export type GoogleAnalyticsArguments =
	| GoogleAnalyticsJsArguments
	| GoogleAnalyticsSetArguments
	| GoogleAnalyticsConsentArguments
	| GoogleAnalyticsGetArguments
	| GoogleAnalyticsConfigArguments
	| GoogleAnalyticsCustomEventArguments
	| GoogleAnalyticsPageViewEventArguments
	| GoogleAnalyticsLoginEventArguments
	| GoogleAnalyticsExceptionEventArguments;

export * from './arguments';
export * from './command';
export * from './config';
export * from './consent';
export * from './event';
export * from './get';
export * from './js';
export * from './measurement-id';
export * from './params';
export * from './set';
