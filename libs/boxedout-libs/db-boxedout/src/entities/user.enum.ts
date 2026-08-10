// @ts-nocheck
/* istanbul ignore file */

export enum UserLockEnum {
  EURO_IN = 'euroInLock',
  EURO_OUT = 'euroOutLock',
  BOXEDOUT = 'boxedoutLock',
  CRYPTO_IN = 'cryptoInLock',
  CRYPTO_OUT = 'cryptoOutLock',
  WITHDRAWAL = 'withdrawalLock',
  TRADING = 'tradingLock',
}

export enum UserLockTypeEnum {
  MULTIPLE_ACCOUNT_LOCK = 'multiple_account_lock',
  BOXEDOUT_LOCK = 'boxedout_lock',
}

export enum LockActionEnum {
  UNLOCK = 'unlock',
  LOCK = 'lock',
}

export const UserLockMapByType: { [P in UserLockTypeEnum]: UserLockEnum[] } = {
  [UserLockTypeEnum.MULTIPLE_ACCOUNT_LOCK]: [
    UserLockEnum.CRYPTO_IN,
    UserLockEnum.CRYPTO_OUT,
    UserLockEnum.EURO_IN,
  ],
  [UserLockTypeEnum.BOXEDOUT_LOCK]: [UserLockEnum.BOXEDOUT],
};
