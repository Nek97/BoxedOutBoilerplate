/**
 * This enum contains the list of app-level events
 * It must not be used by /modules to avoid unwanted
 * dependency with the root level
 */
export enum UserProviderEvents {
  BEFORE_ALL_ROUTES = 'app.before_all_routes',
  AFTER_ALL_ROUTES = 'app.after_all_routes',
}
