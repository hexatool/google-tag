type GoogleTagMeasurementId = `G-${string}`;
type GoogleTagCommand = 'command' | 'get' | 'set' | 'event' | 'consent';
type GoogleTagParamsPrimitives = string | number | boolean | null | undefined;
type GoogleTagParams = GoogleTagParamsPrimitives | Record<string, GoogleTagParamsPrimitives>;
type GoogleTagArguments = [GoogleTagCommand, ...GoogleTagParams[]];

export type { GoogleTagArguments, GoogleTagCommand, GoogleTagMeasurementId };
