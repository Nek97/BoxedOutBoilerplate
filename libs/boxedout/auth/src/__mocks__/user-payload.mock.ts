import { AudienceEnum, IUserPayload } from '../jwt-private.strategy';

export const makeUserPayload = (data?: Partial<IUserPayload>): IUserPayload => {
  const defaultUserPayload = {
    sessionId: 'TEST_SESSION_ID',
    userId: 'TEST_USER_ID',
    aud: AudienceEnum.MOBILE,
    ip: 'TEST_VALID_IP',
  };

  return data
    ? {
        ...defaultUserPayload,
        ...data,
      }
    : defaultUserPayload;
};
