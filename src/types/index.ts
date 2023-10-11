import type { GoogleAnalyticsConfigArguments } from './config';
import type {
	GoogleAnalyticsCustomEventArguments,
	GoogleAnalyticsExceptionEventArguments,
	GoogleAnalyticsLoginEventArguments,
	GoogleAnalyticsPageViewEventArguments,
} from './event';

export type GoogleAnalyticsArguments =
	| GoogleAnalyticsConfigArguments
	| GoogleAnalyticsCustomEventArguments
	| GoogleAnalyticsPageViewEventArguments
	| GoogleAnalyticsLoginEventArguments
	| GoogleAnalyticsExceptionEventArguments;

export * from './command';
export * from './config';
export * from './event';
export * from './measurement-id';
