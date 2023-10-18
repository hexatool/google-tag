import type { GoogleTagMeasurementId } from './measurement-id';
import type { GoogleTagParamsPrimitives } from './params';

type GoogleTagGetCallback = (value?: GoogleTagParamsPrimitives) => void;

type GoogleTagGetArguments = ['get', GoogleTagMeasurementId, string, GoogleTagGetCallback];

export type { GoogleTagGetArguments, GoogleTagGetCallback };
