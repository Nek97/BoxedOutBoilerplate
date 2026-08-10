// @ts-nocheck
import { Options, Context } from '@sentry/types';

export interface SentryModuleOptions {
  sentryOptions: Options;
}

export interface SentryUserInfo extends Context {
  role?: string[];
  userid?: string;
}
