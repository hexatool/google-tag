import type { Transport } from './transport';

const HIT_TYPES_ALLOWED_VALUES = [
	'event',
	'pageview',
	'screenview',
	'transaction',
	'item',
	'social',
	'exception',
	'timing',
];

type HitTypes = (typeof HIT_TYPES_ALLOWED_VALUES)[number];

interface HitTypeObject {
	hitType: HitTypes;
}

interface EventHitType extends HitTypeObject {
	[key: string]: unknown;
	eventAction: string;
	eventCategory: string;
	eventLabel?: string | undefined;
	eventValue?: number | undefined;
	hitType: 'event';
	nonInteraction?: boolean | undefined;
	transport?: Transport | undefined;
}

interface PageViewHitType extends HitTypeObject {
	[key: string]: unknown;
	hitType: 'pageview';
	page?: string;
}

interface ScreenViewHitType extends HitTypeObject {
	hitType: 'screenview';
}

interface TransactionHitType extends HitTypeObject {
	hitType: 'transaction';
}

interface ItemHitType extends HitTypeObject {
	hitType: 'item';
}

interface SocialHitType extends HitTypeObject {
	hitType: 'social';
}

interface ExceptionHitType extends HitTypeObject {
	hitType: 'exception';
}

interface TimingHitType extends HitTypeObject {
	hitType: 'timing';
}

type HitType =
	| EventHitType
	| ScreenViewHitType
	| PageViewHitType
	| TransactionHitType
	| ItemHitType
	| SocialHitType
	| ExceptionHitType
	| TimingHitType;

type NonHitTypeObject<T extends HitType = HitType> = Omit<T, keyof HitTypeObject>;

export type { EventHitType, HitType, HitTypes, NonHitTypeObject, PageViewHitType, TimingHitType };

export { HIT_TYPES_ALLOWED_VALUES };
