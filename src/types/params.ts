import type { GoogleTagMeasurementId } from './measurement-id';

type GoogleTagParamsPrimitives = string | number | boolean | undefined | null;
type GoogleTagParamsPrimitivesWithCallback = GoogleTagParamsPrimitives | ((...args: unknown[]) => void);

type GoogleTagParams = Record<string, GoogleTagParamsPrimitives | GoogleTagParamsPrimitives[]>;

type GoogleTagParamsWithCallback = Record<
	string,
	GoogleTagParamsPrimitivesWithCallback | GoogleTagParamsPrimitivesWithCallback[]
>;

interface GoogleTagCommonParams extends GoogleTagParamsWithCallback {
	event_callback?: () => void;
	event_timeout?: number;
	groups?: string | string[];
	send_to?: GoogleTagMeasurementId | GoogleTagMeasurementId[];
}

export type {
	GoogleTagCommonParams,
	GoogleTagParams,
	GoogleTagParamsPrimitives,
	GoogleTagParamsPrimitivesWithCallback,
	GoogleTagParamsWithCallback,
};
