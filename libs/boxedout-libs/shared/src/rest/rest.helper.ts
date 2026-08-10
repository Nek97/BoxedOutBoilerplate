import { convertCookies } from '../request.helper';
import { HttpStatus } from '@nestjs/common';

/**
 *
 * @param force200 if true the response status will be 200 also in case of error - the legacy BE're returning a 200 response also in case of error
 * @returns a callback with/without the forced status, the callback simply send back the response with the payload. If the endpoint isn't legacy is also possible specify the status
 * For the legacy endpoints is mandatory use the success and data property
 */
export function setRestResponse(
  response: any,
  force200: boolean,
): (payload: any, status?: HttpStatus) => any;
export function setRestResponse(
  response: any,
  force200: true,
): (payload: { success: boolean; data: any }, status?: HttpStatus) => any;
export function setRestResponse(
  response: any,
  force200: false,
): (payload: any, status?: HttpStatus) => any;
export function setRestResponse(response: any, force200 = true) {
  if (force200) {
    return (payload: { success: boolean; data: any }) => {
      return response.status(200).send(payload);
    };
  } else {
    return (payload: any, status?: HttpStatus) => {
      return status
        ? response.status(status).send(payload)
        : response.send(payload);
    };
  }
}

export function isMobileRequest(request: any) {
  const issCheck = request.user.iss !== 'mobile';
  const cookies = convertCookies(request.headers.cookie);
  return issCheck && cookies['Mobile'];
}
