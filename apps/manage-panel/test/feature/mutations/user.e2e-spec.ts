/* istanbul ignore file */

import { RoleEnum } from '@boxedout-libs/shared/role.enum';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import {
  getTestFilename,
  initApp,
  runQuery,
} from '../../../../../libs/boxedout-libs/shared/src/jest/jest.helper';
import { testingEntry } from '@boxedout-libs/shared/seeder-helper';
import { ManagePanelModule } from '@boxedout-app/manage-panel/manage-panel.module';
import { UserProviderModule } from '@boxedout-app/user-provider/user-provider.module';
import { VerificationStatus } from '@boxedout-libs/shared/enum/verification-status.enum';

jest.mock('decimal.js', () => {
  const Decimal = jest.fn((value: any) => ({
    lt: jest.fn((x: any) => value < x),
    plus: jest.fn((x: any) => Decimal(x + value)),
  }));
  return {
    ...jest.requireActual<any>('decimal.js'),
    Decimal: Decimal,
  };
});
const fixedGuid = testingEntry.guid;

describe(`mutation/${getTestFilename(__filename)} : userEntity test`, () => {
  let app: NestFastifyApplication;
  let loginApp: NestFastifyApplication;

  beforeAll(async () => {
    loginApp = await initApp(UserProviderModule.forRoot({ onlyAuth: true }));
    app = await initApp(ManagePanelModule.forRoot());
  });

  afterAll(async () => {
    loginApp && (await loginApp.close());
    app && (await app.close());
  });

  it('Should update affiliatePct field in User Entity', async () => {
    const affiliatePct = 80;
    const queryName = 'ManageUser_updateUserAffiliatePct';

    const query = `mutation{
      ManageUser_updateUserAffiliatePct(
        input: {
          affiliatePct: ${affiliatePct}
        },
        conditions: {
          ID: "${fixedGuid}"
        }
      ){
        ID,
        affiliatePct,
      }
    }`;

    await runQuery({
      app,
      loginApp,
      query,
      queryName,
      role: RoleEnum.AFFILIATE,
      callback: (body) => {
        const returnedData = body.data?.[queryName];
        const error = body.errors?.length ? body.errors[0].message : undefined;

        expect(returnedData?.nodes).not.toBeDefined();
        expect(returnedData.ID).toBe(fixedGuid);
        expect(returnedData.affiliatePct).toBe(affiliatePct);
        expect(error).not.toBeDefined();
      },
    });
  });

  describe('Check UserCompensate Mutations', () => {
    let requestIdCreated: number;
    it('Should add a compensation request for a user', async () => {
      const queryNameAddRequest = 'ManageUser_UserCompensateAddRequest';
      const queryAddRequest = `mutation {
        ManageUser_UserCompensateAddRequest(
          conditions: {
            userId: "${fixedGuid}"
          }, 
          input: {
            amount: 100,
            comment: "This is a comment"
            reason: HACK,
            status: APPROVED
            }) {
          verifier1
          comment
          requestId
          amount
          status
        }
      }
      `;
      await runQuery({
        app,
        loginApp,
        query: queryAddRequest,
        queryName: queryNameAddRequest,
        role: RoleEnum.AGENT,
        callback: (body) => {
          const returnedData = body.data?.[queryNameAddRequest];
          const error = body.errors?.length
            ? body.errors[0].message
            : undefined;

          expect(returnedData?.nodes).not.toBeDefined();
          const { verifier1, status, requestId } = returnedData;
          requestIdCreated = requestId;
          expect(verifier1).toBeDefined();
          expect(status).toBe(
            VerificationStatus.AWAITING_MANUAL_APPROVAL.toUpperCase(),
          );
          expect(error).not.toBeDefined();
        },
      });
    });

    it('Should update a compensation request for a user when APPROVED', async () => {
      const queryNameUpdateRequest = 'ManageUser_UserCompensateUpdateRequest';
      const queryUpdateRequest = `mutation {
        ManageUser_UserCompensateUpdateRequest(
          conditions: {
            requestId: ${requestIdCreated},
            userId: "${fixedGuid}"
          },
          input: {
          status: APPROVED
            }) {
          verifier1
          verifier2
          comment
          requestId
          amount
          status
        }
      }
      `;
      await runQuery({
        app,
        loginApp,
        query: queryUpdateRequest,
        queryName: queryNameUpdateRequest,
        role: RoleEnum.SHIFT_LEAD,
        callback: (body) => {
          const returnedData = body.data?.[queryNameUpdateRequest];
          const error = body.errors?.length
            ? body.errors[0].message
            : undefined;
          expect(returnedData?.nodes).not.toBeDefined();
          const { verifier1, verifier2, status } = returnedData;
          expect(verifier1).toBeDefined();
          expect(verifier2).toBeDefined();
          expect(status).toBe(VerificationStatus.APPROVED.toUpperCase());
          expect(error).not.toBeDefined();
        },
      });
    });
  });
});
