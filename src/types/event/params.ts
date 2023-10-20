import type { GoogleTagSetAndEventParams } from '../params';

export interface GoogleTagEventCommonParams extends GoogleTagSetAndEventParams {
	non_interaction?: boolean;
}
