import type { GoogleAnalyticsConfigArguments } from './config';
import type { GoogleAnalyticsConsentArguments } from './consent';
import type {
	GoogleAnalyticsCustomEventArguments,
	GoogleAnalyticsExceptionEventArguments,
	GoogleAnalyticsLoginEventArguments,
	GoogleAnalyticsPageViewEventArguments,
} from './event';
import type { GoogleAnalyticsGetArguments } from './get';
import type { GoogleAnalyticsSetArguments } from './set';

export type GoogleAnalyticsArguments =
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
export * from './event';
export * from './get';
export * from './measurement-id';
export * from './params';
export * from './set';
