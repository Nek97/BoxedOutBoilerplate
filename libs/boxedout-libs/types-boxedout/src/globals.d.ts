import './modules';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /**
       * Seconds to wait before the same user can be re-added inside the verification queue
       */
      BOXEDOUT_VERIFICATION_SAME_USER_WAIT_SECONDS?: string;
      /**
       * Seconds to wait before the same verifier can approve a request
       */
      BOXEDOUT_VERIFICATION_VERIFIER2_WAIT_SECONDS?: string;
      /**
       * Modular logger levels
       */
      NEST_LOGGER_LEVELS_MANAGE_MONITOR_REFUND?: LogLevel | string;
      NEST_LOGGER_LEVELS_MANAGE_USER_COMPENSATE?: LogLevel | string;
    }
  }
}
