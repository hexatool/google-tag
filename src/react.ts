import { useEffect } from 'react';

import type { GoogleTagOptions } from './google-tag';
import GoogleTag from './google-tag';
import type { GoogleTagMeasurementId, InitializeOptions } from './types';

interface GoogleTagHookOptions extends GoogleTagOptions, InitializeOptions {
	initialize?: boolean;
}

function useGoogleTag(...measurementIds: GoogleTagMeasurementId[]): GoogleTag;
function useGoogleTag(options: GoogleTagHookOptions): GoogleTag;
function useGoogleTag(...args: [GoogleTagHookOptions | GoogleTagMeasurementId, ...GoogleTagMeasurementId[]]): GoogleTag;
function useGoogleTag(
	...args: [GoogleTagHookOptions | GoogleTagMeasurementId, ...GoogleTagMeasurementId[]]
): GoogleTag {
	const [first, ...rest] = args;
	let ga: GoogleTag;
	let initOptions: InitializeOptions = {};
	let initialize = false;
	if (typeof first === 'string') {
		ga = new GoogleTag(first, ...rest);
	} else if (typeof first === 'object') {
		ga = new GoogleTag(first);
		initialize = first.initialize ?? false;
		initOptions = first;
	} else {
		throw new TypeError(`Expected a string or an object, got ${typeof first}.`);
	}
	useEffect(() => {
		if (initialize) {
			ga.initialize(initOptions);
		}
	}, [initialize]);

	return ga;
}

export type { GoogleTagHookOptions };

export * from './index';
export { useGoogleTag };
