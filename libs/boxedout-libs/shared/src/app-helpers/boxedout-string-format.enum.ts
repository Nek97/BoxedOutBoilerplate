// @ts-nocheck
export enum BoxedOutStringFormatEnum {
  ALL = '^[<>&\'"/]+$',
  ALL_EMAIL = '^[<>&\'"]+$',
  BASE64_PART = '^[A-Za-z0-9+/=]+$',
  COMMENT = '^[<>\'"]+$',
  ALPHANUMERIC = '^[A-Za-zÀ-ÿ0-9]+$',
  AFFILIATE = '^[A-Za-zÀ-ÿ0-9_]+$',
  ID_NUMBER = '^[A-Za-z0-9]+$',
  NUMBER = '^[0-9]+$',
  NAME = "^[A-Za-zÀ-ÿ\\s'`´‘’.-]+$",
}
