import type { GoogleAnalyticsCommand } from '../command';

export type GoogleAnalyticsEventArgumentsTyped<
	Command extends GoogleAnalyticsCommand,
	EventName extends string,
	Params,
> = [Command, EventName, Params?];
