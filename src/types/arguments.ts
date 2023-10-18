import type { GoogleTagCommand } from './command';

export type GoogleTagArgumentsTyped<Command extends GoogleTagCommand, EventName extends string, Params> = [
	Command,
	EventName,
	Params?,
];
