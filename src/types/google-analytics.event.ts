import type { Transport } from './transport';

export interface GoogleAnalyticsEvent {
	action: string;
	category: string;
	label?: string;
	nonInteraction?: boolean;
	transport?: Transport;
	value?: number;
}
