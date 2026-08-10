// @ts-nocheck
import * as googlePhone from 'google-libphonenumber';
import { ErrorsEnum } from '@boxedout-libs/errors/errors.enum';

const phoneUtil = googlePhone.PhoneNumberUtil.getInstance();

export function stringIsInEnumOrThrow<T>(
  toCheck: string,
  enumName: T,
  message?: string,
): boolean {
  if (stringIsInEnum(toCheck, enumName)) {
    return true;
  }
  const err = message ? message : `${ErrorsEnum.INVALID_VALUE} ${toCheck}`;
  throw new Error(err);
}

export function stringIsInEnum<T>(toCheck: string, enumName: T): boolean {
  for (const enumProperty of Object.values(enumName)) {
    if (enumProperty.toLowerCase() === toCheck.toLowerCase()) {
      return true;
    }
  }
  return false;
}

export function formatPhone(phone: any) {
  try {
    const parsedPhone = phoneUtil.parse(phone);
    const PNF = googlePhone.PhoneNumberFormat;
    const parsedPhoneNumber = phoneUtil.format(parsedPhone, PNF.INTERNATIONAL);
    return { parsedPhoneNumber, parsedPhone };
  } catch (error) {
    throw new Error(ErrorsEnum.INVALID_PHONE);
  }
}

export function validatePhone(phone: any) {
  const { parsedPhoneNumber, parsedPhone } = formatPhone(phone);
  if (!parsedPhone || !phoneUtil.isValidNumber(parsedPhone)) {
    throw new Error(ErrorsEnum.INVALID_PHONE);
  }

  return parsedPhoneNumber;
}
