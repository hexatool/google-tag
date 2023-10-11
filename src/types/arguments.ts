import type { GoogleAnalyticsCommand } from './command';

export type GoogleAnalyticsArgumentsTyped<Command extends GoogleAnalyticsCommand, EventName extends string, Params> = [
	Command,
	EventName,
	Params?,
];
