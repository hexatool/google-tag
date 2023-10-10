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
] as const;

type HitTypes = (typeof HIT_TYPES_ALLOWED_VALUES)[number];

interface HitTypeObject {
	hitType: HitTypes;
}

interface EventHitType extends HitTypeObject {
	eventAction: string;
	eventCategory: string;
	eventLabel?: string | undefined;
	eventValue?: number | undefined;
	hitType: 'event';
	nonInteraction?: boolean | undefined;
	transport?: Transport | undefined;

	[key: string]: unknown;
}

interface PageViewHitType extends HitTypeObject {
	hitType: 'pageview';
	page?: string;
	title?: string;

	[key: string]: unknown;
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
	category: string;
	hitType: 'timing';
	label?: string | undefined;
	value?: number | undefined;
	variable: string;
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

type NonHitTypePageView = Omit<NonHitTypeObject<PageViewHitType>, 'page'>;

export type { EventHitType, HitType, HitTypes, NonHitTypeObject, NonHitTypePageView, PageViewHitType, TimingHitType };

export { HIT_TYPES_ALLOWED_VALUES };
