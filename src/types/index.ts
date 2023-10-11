type GoogleAnalyticsMeasurementId = `G-${string}`;

type GoogleAnalyticsEvent = 'page_view' | 'login' | 'exception';
type GoogleAnalyticsCommand = 'command' | 'get' | 'set' | 'event' | 'consent';

type GoogleAnalyticsParamsPrimitives = string | number | boolean | (() => void);
type GoogleAnalyticsParams = Record<string, GoogleAnalyticsParamsPrimitives | GoogleAnalyticsParamsPrimitives[]>;

type GoogleAnalyticsEventArgumentsTyped<Command extends GoogleAnalyticsCommand, EventName extends string, Params> = [
	Command,
	EventName,
	Params?,
];

interface GoogleAnalyticsEventCommonParams extends GoogleAnalyticsParams {
	event_callback?: () => void;
	event_timeout?: number;
	groups?: string | string[];
	non_interaction?: boolean;
	send_to?: GoogleAnalyticsMeasurementId | GoogleAnalyticsMeasurementId[];
}

interface GoogleAnalyticsPageViewEventParams extends GoogleAnalyticsEventCommonParams {
	client_id?: string;
	language?: string;
	page_encoding?: string;
	page_location?: string;
	page_title?: string;
	user_agent?: string;
}

type GoogleAnalyticsPageViewEventArguments = GoogleAnalyticsEventArgumentsTyped<
	'event',
	'page_view',
	GoogleAnalyticsPageViewEventParams
>;

interface GoogleAnalyticsLoginEventParams extends GoogleAnalyticsEventCommonParams {
	method?: string;
}

type GoogleAnalyticsLoginEventArguments = GoogleAnalyticsEventArgumentsTyped<
	'event',
	'login',
	GoogleAnalyticsLoginEventParams
>;

interface GoogleAnalyticsExceptionEventParams extends GoogleAnalyticsEventCommonParams {
	description?: string;
	fatal?: boolean;
}

type GoogleAnalyticsExceptionEventArguments = GoogleAnalyticsEventArgumentsTyped<
	'event',
	'exception',
	GoogleAnalyticsExceptionEventParams
>;

interface GoogleAnalyticsCustomEventParams extends GoogleAnalyticsEventCommonParams {
	event_category?: string;
	event_label?: string;
	value?: number;
}

type GoogleAnalyticsEventArguments = GoogleAnalyticsEventArgumentsTyped<
	'event',
	string,
	GoogleAnalyticsCustomEventParams
>;

type GoogleAnalyticsArguments =
	| GoogleAnalyticsEventArguments
	| GoogleAnalyticsPageViewEventArguments
	| GoogleAnalyticsLoginEventArguments
	| GoogleAnalyticsExceptionEventArguments;

export type {
	GoogleAnalyticsArguments,
	GoogleAnalyticsCommand,
	GoogleAnalyticsEvent,
	GoogleAnalyticsEventArguments,
	GoogleAnalyticsEventCommonParams,
	GoogleAnalyticsExceptionEventArguments,
	GoogleAnalyticsExceptionEventParams,
	GoogleAnalyticsLoginEventArguments,
	GoogleAnalyticsLoginEventParams,
	GoogleAnalyticsMeasurementId,
	GoogleAnalyticsPageViewEventArguments,
	GoogleAnalyticsPageViewEventParams,
	GoogleAnalyticsParams,
};
