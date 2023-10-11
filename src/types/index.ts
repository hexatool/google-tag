import type {
	GoogleAnalyticsCustomEventArguments,
	GoogleAnalyticsExceptionEventArguments,
	GoogleAnalyticsLoginEventArguments,
	GoogleAnalyticsPageViewEventArguments,
} from './event';

export type GoogleAnalyticsArguments =
	| GoogleAnalyticsCustomEventArguments
	| GoogleAnalyticsPageViewEventArguments
	| GoogleAnalyticsLoginEventArguments
	| GoogleAnalyticsExceptionEventArguments;

export * from './command';
export * from './event';
export * from './measurement-id';
