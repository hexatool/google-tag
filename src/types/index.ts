import type { GoogleAnalyticsConfigArguments } from './config';
import type {
	GoogleAnalyticsCustomEventArguments,
	GoogleAnalyticsExceptionEventArguments,
	GoogleAnalyticsLoginEventArguments,
	GoogleAnalyticsPageViewEventArguments,
} from './event';
import type { GoogleAnalyticsGetArguments } from './get';

export type GoogleAnalyticsArguments =
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
