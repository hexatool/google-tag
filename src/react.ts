import { useEffect } from 'react';

import type { GoogleAnalyticsOptions } from './google-analytics';
import GoogleAnalytics from './google-analytics';
import type { GoogleAnalyticsMeasurementId, InitializeOptions } from './types';

interface GoogleAnalyticsHookOptions extends GoogleAnalyticsOptions, InitializeOptions {
	initialize?: boolean;
}

export type { GoogleAnalyticsHookOptions };

export { GoogleAnalytics };

export * from './index';

export default function useGoogleAnalytics(...measurementIds: GoogleAnalyticsMeasurementId[]): GoogleAnalytics;
export default function useGoogleAnalytics(options: GoogleAnalyticsHookOptions): GoogleAnalytics;
export default function useGoogleAnalytics(
	...args: [GoogleAnalyticsHookOptions | GoogleAnalyticsMeasurementId, ...GoogleAnalyticsMeasurementId[]]
): GoogleAnalytics;
export default function useGoogleAnalytics(
	...args: [GoogleAnalyticsHookOptions | GoogleAnalyticsMeasurementId, ...GoogleAnalyticsMeasurementId[]]
): GoogleAnalytics {
	const [first, ...rest] = args;
	let ga: GoogleAnalytics;
	let initOptions: InitializeOptions = {};
	let initialize = false;
	if (typeof first === 'string') {
		ga = new GoogleAnalytics(first, ...rest);
	} else if (typeof first === 'object') {
		ga = new GoogleAnalytics(first);
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
