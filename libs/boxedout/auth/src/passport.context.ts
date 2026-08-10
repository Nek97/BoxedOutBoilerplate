/* istanbul ignore file */

import * as passport from 'passport';
/**
 * Private method copied from @nestjs/passport/lib/auth.guard.ts
 */
export const createPassportContext =
  (request: any, response: any) =>
  (
    type: any,
    options: any,
    callback: { (err: any, user: any, info: any, status: any): void },
  ) =>
    new Promise<void>((resolve, reject) =>
      passport.authenticate(
        type,
        options,
        (err: any, user: any, info: any, status: any) => {
          try {
            request.authInfo = info;
            return resolve(callback(err, user, info, status));
          } catch (err) {
            reject(err);
          }
        },
      )(request, response, (err: any) => (err ? reject(err) : resolve())),
    );
