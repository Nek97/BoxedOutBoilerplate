import { ObjectLiteral } from 'typeorm';

export function convertCookies(cookiesString?: string) {
  const cookies: ObjectLiteral = {};
  let temp: string[];
  if (cookiesString) {
    const temp_cookies: string[] = cookiesString.split('; ');
    for (const cookie of temp_cookies) {
      temp = cookie.split('=');
      cookies[temp[0]] = temp[1];
    }
  }
  return cookies;
}
