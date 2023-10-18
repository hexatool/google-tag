import type { GoogleTagConfigArguments } from './config';
import type { GoogleTagConsentArguments } from './consent';
import type {
	GoogleTagCustomEventArguments,
	GoogleTagExceptionEventArguments,
	GoogleTagLoginEventArguments,
	GoogleTagPageViewEventArguments,
} from './event';
import type { GoogleTagGetArguments } from './get';
import type { GoogleTagJsArguments } from './js';
import type { GoogleTagSetArguments, GoogleTagSetMeasurementIdArguments } from './set';

export type GoogleTagArguments =
	| GoogleTagJsArguments
	| GoogleTagSetArguments
	| GoogleTagSetMeasurementIdArguments
	| GoogleTagConsentArguments
	| GoogleTagGetArguments
	| GoogleTagConfigArguments
	| GoogleTagCustomEventArguments
	| GoogleTagPageViewEventArguments
	| GoogleTagLoginEventArguments
	| GoogleTagExceptionEventArguments;

export * from './arguments';
export * from './command';
export * from './config';
export * from './consent';
export * from './event';
export * from './get';
export * from './initialize';
export * from './js';
export * from './measurement-id';
export * from './params';
export * from './set';
