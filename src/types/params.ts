type GoogleAnalyticsParamsPrimitives = string | number | boolean;
type GoogleAnalyticsParamsPrimitivesWithCallback = GoogleAnalyticsParamsPrimitives | ((...args: unknown[]) => void);

type GoogleAnalyticsParams = Record<
	string,
	GoogleAnalyticsParamsPrimitivesWithCallback | GoogleAnalyticsParamsPrimitivesWithCallback[]
>;

export type { GoogleAnalyticsParams, GoogleAnalyticsParamsPrimitives, GoogleAnalyticsParamsPrimitivesWithCallback };
