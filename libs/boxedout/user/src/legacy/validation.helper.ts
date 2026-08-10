import { ValidationFilters } from '@boxedout/user/legacy/constants';
import validator from 'validator';
import { GeneralError } from '@boxedout/user/legacy/common.error';

export function whitelist(input: any, filter: ValidationFilters) {
  // Don't check empty input
  /* eslint no-useless-escape: 0 */
  if (!input) {
    return input;
  }
  try {
    if (filter !== ValidationFilters.PASSWORD && typeof input === 'string') {
      input = input.trim();
    }
    if (filter === ValidationFilters.ALL) {
      return validator.blacklist(input, '<>&\'"/');
    }
    if (filter === ValidationFilters.ALPHANUMERIC) {
      return validator.whitelist(input, 'A-Za-zÀ-ÿ0-9');
    }
    if (filter === ValidationFilters.AFFILIATE) {
      return validator.whitelist(input, 'A-Za-z0-9_');
    }
    if (filter === ValidationFilters.ALPHABET) {
      return validator.whitelist(input, 'A-Za-zÀ-ÿ');
    }
    if (filter === ValidationFilters.WALLET) {
      return validator.whitelist(input, 'A-Za-zÀ-ÿ0-9:_.-');
    }
    if (filter === ValidationFilters.TXFILTER) {
      return validator.whitelist(input, 'A-Za-zÀ-ÿ0-9:,');
    }
    if (filter === ValidationFilters.BOOLEAN) {
      return validator.isBoolean(input) ? input : false;
    }
    if (filter === ValidationFilters.BOOLEANNEW) {
      return validator.isBoolean(input);
    }
    if (filter === ValidationFilters.EMAIL) {
      input = validator.blacklist(input, '<>&\'"/'); // Some of these characters are allowed within double quotes, easier to just remove them.
      return validator.isEmail(input) && validator.normalizeEmail(input);
    }
    if (filter === ValidationFilters.NAME) {
      // eslint-disable-next-line quotes
      return validator.whitelist(input, "A-Za-zÀ-ÿ\\s'`´‘’.-");
    }
    if (filter === ValidationFilters.NUMERIC) {
      return validator.isDecimal(input) ? input : false;
    }
    /**
     * The whitelist method doesn't work with words.
     * https://github.com/validatorjs/validator.js/blob/master/src/lib/whitelist.js
     */
    if (filter === ValidationFilters.LANGUAGE) {
      const str = input.toLowerCase();
      return validator.matches(str, 'nl|en|fr|it|es|de') ? str : undefined;
    }
    /**
     * The whitelist method doesn't work with words.
     * https://github.com/validatorjs/validator.js/blob/master/src/lib/whitelist.js
     */
    if (filter === ValidationFilters.COUNTRY) {
      const str = input.toLowerCase();
      return validator.matches(
        str,
        'at|be|bg|ch|cz|de|dk|ee|es|fi|fr|gr|hu|ie|it|li|lt|lu|lv|mt|nl|no|pl|pt|ro|se|si|sk|uk',
      )
        ? str
        : undefined;
    }
    if (filter === ValidationFilters.PASSWORD) {
      return input.toString();
    }
    if (filter === ValidationFilters.BASE64) {
      return validator.isBase64(input) ? input : false;
    }
    if (filter === ValidationFilters.BASE64_PART) {
      return validator.whitelist(input, 'A-Za-z0-9+/=');
    }
    if (filter === ValidationFilters.PHONE) {
      return validator.whitelist(input, '0-9-s()');
    }
    if (filter === ValidationFilters.TWO_FACTOR) {
      return validator.whitelist(input, '0-9');
    }
    if (filter === ValidationFilters.UUID) {
      return validator.isUUID(input) ? input : false;
    }
    if (filter === ValidationFilters.ERROR) {
      return validator.whitelist(input, "A-Za-zÀ-ÿ\\s'`´‘’.-_");
    }
    if (filter === ValidationFilters.ISO_DATE) {
      const regEx = /^\d{4}-\d{2}-\d{2}$/;
      return input.match(regEx) !== null ? input : false;
    }
    if (filter === ValidationFilters.JSON) {
      return validator.isJSON(input) ? input : false;
    }
  } catch (error) {
    throw new GeneralError();
  }
}
