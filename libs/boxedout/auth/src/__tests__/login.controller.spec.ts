import { createMock } from '@golevelup/ts-jest';
import { Request } from '@nestjs/common';
import { AuthService } from '../auth.service';
import * as $ from '../login.controller';
import { LoginController } from '../login.controller';

const fixedCsrf = 'qwerty1234qwerty';
const fixedJwt = 'jwt';

describe('login controller', () => {
  let mockedAuthService: AuthService;
  let testController: LoginController;

  beforeEach(() => {
    mockedAuthService = createMock<AuthService>();
    testController = new LoginController(mockedAuthService);
  });

  it('setLoginCookies should work', () => {
    const fixedResponse = {
      raw: {
        setHeader: jest
          .fn()
          .mockImplementation((name: string, val: string[]) => {
            return { [name]: val };
          }),
      },
    };
    const spiedSetHeader = jest.spyOn(fixedResponse.raw, 'setHeader');
    expect(spiedSetHeader).not.toHaveBeenCalled();
    $.setLoginCookies(fixedResponse, fixedCsrf, fixedJwt);
    expect(spiedSetHeader).toHaveBeenCalled();
  });

  it('getIss should work', () => {
    let result = $.getIss('something');
    expect(result).toEqual('something');

    result = $.getIss(undefined);
    expect(result).toEqual('localhost');
  });

  it('test the login', async () => {
    const spiedIp = jest
      .spyOn(mockedAuthService, 'getIpFromRequest')
      .mockReturnValueOnce('127.0.0.1');
    const spiedLogin = jest
      .spyOn(mockedAuthService, 'login')
      .mockResolvedValueOnce({ Authorization: fixedJwt, csrf: fixedCsrf });
    const mockedRequest = createMock<Request>();
    const fixedResponse = {
      raw: {
        setHeader: jest
          .fn()
          .mockImplementation((name: string, val: string[]) => {
            return { [name]: val };
          }),
      },
      status: jest.fn().mockImplementation((s) => {
        return {
          [s]: s,
          send: jest.fn().mockImplementationOnce((a) => a),
        };
      }),
    };
    await testController.login(
      mockedRequest,
      { email: '', password: '' },
      fixedResponse,
    );
    expect(spiedIp).toHaveBeenCalled();
    expect(spiedLogin).toHaveBeenCalled();
  });
});
