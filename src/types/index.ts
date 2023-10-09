type CommandType = 'send' | 'set';

type ClientIdCallBack = (clientId: string) => void;

export type { ClientIdCallBack, CommandType };

export * from './google-analytics.event';
export * from './google-analytics.options';
export * from './google-tag.options';
export * from './hit-type';
export * from './transport';
