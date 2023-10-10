type GoogleTagMeasurementId = `G-${string}`;
type GoogleTagCommand = 'command' | 'get' | 'set' | 'event' | 'consent';
type GoogleTagArguments = [GoogleTagCommand, ...unknown[]];

export type { GoogleTagArguments, GoogleTagCommand, GoogleTagMeasurementId };
