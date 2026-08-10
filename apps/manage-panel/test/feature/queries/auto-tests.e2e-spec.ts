/* istanbul ignore file */

/* eslint-disable no-console */
import * as request from 'supertest';
import { appendFileSync, writeFileSync } from 'fs';
import { ManagePanelModule } from '@boxedout-app/manage-panel/manage-panel.module';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import * as queryStorage from './queries';
import { join } from 'path';
import { ALL_ROLES, RoleEnum } from '@boxedout-libs/shared/role.enum';
import {
  getJWT,
  getTestFilename,
  initApp,
} from '@boxedout-libs/shared/jest/jest.helper';
import * as faker from 'faker';
import { ErrorsEnum } from '@boxedout-libs/errors/errors.enum';
import { testingEntry } from '@boxedout-libs/shared/seeder-helper';
import {
  BankAccountStatus,
  ManualNameCheck,
} from '@boxedout-libs/db-eur/entities/bank-account.enum';
import { fixedCustomCodeId } from '@boxedout-libs/db-affiliate/factories/custom-code.factory';
import { UserIdentityStatusEnum } from '@boxedout-libs/db-boxedout/entities/user-identity-document.enum';
import { UserProviderModule } from '@boxedout-app/user-provider/user-provider.module';
import { AssetCodeEnum } from '@boxedout-libs/shared/asset.enum';

const UPDATE_QUERIES = process.env.UPDATE_QUERIES ? true : false;

// Fields can be two things: either a field of a type
// or a field of queries, essentially the query itself (like _service)
// These fields will not be checked or queried.
// (it is no longer necessary to specify nested resources to skip, this is handled through buildFieldsToSkip)
const fieldsToSkip = [
  '_service',
  '_entities',
  'ManageUser_getSelfData',
  'ManageCrypto_getWalletGridByCryptoAsset',
  'ManageAssetValue_getEurValue',
  'ManageAssetValue_getHistoricalEurValue',
  'ManageUser_getRoleEnum',
  'User_getUserAddress',
];

const defaultGuid = testingEntry.guid;
const defaultFiat = testingEntry.fiatKeys[0];
const defaultAsset = testingEntry.assetKeys[0];

const dedfaultStatusValue: { value: keyof typeof BankAccountStatus } = {
  value: 'PENDING',
};

const defaultManualNameCheckValue: { value: keyof typeof ManualNameCheck } = {
  value: 'CHECKED',
};
interface IMapValue {
  role?: RoleEnum | RoleEnum[];
  args?: { [key: string]: string | { value: string } };
  version?: number;
}
interface IQueryMap {
  [key: string]: IMapValue[];
}

// NOTE: Only use the args when we are talking about a grid with required params.
// When non grid, you have to provide a explicity values for each argument in your query.
// When grid without required params, no params are passed, but first field is used for sorting.
const queryMap: IQueryMap = {
  ManageMetaData_test_getUnclaimedDepositGrid: [{ version: 2 }],
  ManageMetaData_test_getUnclaimedDeposit: [
    {
      version: 2,
      args: { depositByChainId: '5-XLM' },
    },
  ],
  ManageExchange_getMarketGrid: [{ role: RoleEnum.AGENT }],
  ManageEURWallet_getBankAccountByUserId: [
    {
      role: RoleEnum.COMPLIANCE_BANK,
      args: { userId: defaultGuid },
    },
  ],
  ManageEURWallet_getBankAccountGridForCompliance: [
    {
      role: RoleEnum.COMPLIANCE_BANK,
      args: {
        status: dedfaultStatusValue,
      },
    },
    {
      role: RoleEnum.COMPLIANCE_BANK,
      args: {
        manualNameCheck: defaultManualNameCheckValue,
      },
    },
  ],
  ManageEURWallet_getBankAccountGridForAgent: [
    {
      role: RoleEnum.AGENT,
      args: { userId: defaultGuid },
    },
  ],
  ManageExchange_getAssetGrid: [{ role: RoleEnum.AGENT }],
  // ManageCrypto_getWalletGridByCryptoAsset: [
  //   {
  //     role: RoleEnum.AGENT,
  //     args: { cryptoAsset: { value: AssetCodeEnum.BTC } },
  //   },
  //   {
  //     role: RoleEnum.AGENT,
  //     args: { cryptoAsset: { value: AssetCodeEnum.KMD } },
  //   },
  // ],
  ManageMonitor_getAsset: [
    {
      role: RoleEnum.AUDIT_TRANSACTION,
      args: { ID: defaultAsset },
    },
  ],
  ManageMonitor_getAssetGrid: [{ role: RoleEnum.AUDIT_TRANSACTION }],
  ManageMonitor_getAssetGridByUserId: [
    {
      role: RoleEnum.AGENT,
      args: { userId: defaultGuid },
    },
  ],
  ManageMonitor_getAllowedIpGrid: [{ role: RoleEnum.MANAGEMENT }],
  ManageMonitor_getFiat: [
    {
      role: RoleEnum.AUDIT_TRANSACTION,
      args: { ID: defaultFiat },
    },
  ],
  ManageMonitor_getFiatGrid: [{ role: RoleEnum.AUDIT_TRANSACTION }],
  ManageMonitor_getFiatGridByUserId: [
    {
      role: RoleEnum.AGENT,
      args: { userId: defaultGuid },
    },
  ],
  ManageMonitor_getUserDynamic: [
    {
      role: RoleEnum.AUDIT_USER,
      args: { ID: defaultGuid },
    },
  ],
  ManageMonitor_getUserDynamicGrid: [{ role: RoleEnum.AUDIT_USER }],
  ManageMonitor_getTagGrid: [{ role: RoleEnum.AGENT }],
  ManageUser_getUserGrid: [{ role: RoleEnum.MANAGEMENT }],
  ManageUser_getUserForAgentGrid: [{ role: RoleEnum.AGENT }],
  ManageUser_getUser: [{ role: RoleEnum.AGENT, args: { ID: defaultGuid } }],
  ManageUser_getUserIdentityDocument: [
    {
      role: RoleEnum.COMPLIANCE_ID,
      args: { xx: { value: '12345' } },
    },
  ],
  ManageUser_getUserIdentityDocumentForAgentGridByUserId: [
    {
      role: RoleEnum.AGENT,
      args: { userId: defaultGuid },
    },
  ],
  ManageUser_getUserIdentityDocumentGridByStatus: [
    {
      role: RoleEnum.COMPLIANCE_ID,
      args: {
        status: { value: Object.keys(UserIdentityStatusEnum)[0].toUpperCase() },
      },
    },
  ],
  ManageUser_getUserIdentityDocumentGlobalGridOnRequest: [
    {
      role: RoleEnum.COMPLIANCE_ID,
    },
  ],
  ManageUser_getUserEmailGrid: [
    {
      role: RoleEnum.AGENT,
      args: { userId: defaultGuid },
    },
  ],
  ManageUser_getUserPhoneGrid: [
    {
      role: RoleEnum.AGENT,
      args: { userId: defaultGuid },
    },
  ],
  ManageUser_getUserMobileDeviceGrid: [
    {
      role: RoleEnum.AGENT,
      args: { userId: defaultGuid },
    },
  ],
  ManageUser_getUserDeviceGrid: [
    {
      role: RoleEnum.AGENT,
      args: { userId: defaultGuid },
    },
  ],
  ManageUser_getUserProofOfFunds: [
    { role: RoleEnum.AGENT, args: { userId: defaultGuid } },
  ],
  ManageUser_getUserProofOfFundsGrid: [
    { role: RoleEnum.COMPLIANCE_PROOF_OF_FUNDS },
  ],
  ManageUser_getUserIdentity: [
    { role: RoleEnum.AGENT, args: { ID: defaultGuid } },
  ],
  ManageUser_getUserIdentityGrid: [{ role: RoleEnum.AGENT }],
  ManageMonitor_getLogActionGrid: [{ role: RoleEnum.SHIFT_LEAD }],
  ManageMonitor_getLogActionGridSelf: [{ role: ALL_ROLES }],
  ManageMonitor_getLogActionGridByUserId: [
    {
      role: RoleEnum.AGENT,
      args: { userId: defaultGuid },
    },
  ],
  ManageMonitor_getLogViewGrid: [{ role: RoleEnum.SHIFT_LEAD }],
  ManageUser_getUserQuestionnaireGrid: [
    {
      role: RoleEnum.AGENT,
      args: { userId: defaultGuid },
    },
  ],
  ManageMonitor_getCommentGridByUserId: [
    {
      role: RoleEnum.AGENT,
      args: { userId: defaultGuid },
    },
  ],
  ManageMonitor_getCommentGridByAdminId: [
    {
      role: RoleEnum.AGENT,
      args: { adminId: defaultGuid },
    },
  ],
  ManageUser_getUserLogGridByUserId: [
    {
      role: RoleEnum.AGENT,
      args: { userId: defaultGuid },
    },
  ],
  ManageUser_getUserLogExtendedGrid: [
    {
      role: RoleEnum.AGENT,
      args: { userId: defaultGuid },
    },
  ],
  ManageUser_getUserLogGridAuditUser: [
    { role: RoleEnum.AUDIT_USER, args: { ip: testingEntry.ips[0] } },
    {
      role: RoleEnum.AUDIT_USER,
      args: { device: testingEntry.userDevices[0].token },
    },
  ],
  ManageUser_getAdminLogGridByUserId: [
    { role: RoleEnum.AGENT, args: { userId: defaultGuid } },
  ],
  ManageUser_getAdminLogGridByAdminId: [
    { role: RoleEnum.MANAGEMENT, args: { adminId: defaultGuid } },
  ],
  ManageMonitor_getUserTagGridByTag: [
    {
      role: RoleEnum.AUDIT_USER,
      args: { tag: testingEntry.tags[0] },
    },
  ],
  ManageUser_getAssignedRoleGrid: [{ role: RoleEnum.MANAGEMENT }],
  ManageMonitor_getWatchlistHitGrid: [
    { role: RoleEnum.COMPLIANCE_SANCTIONLIST },
  ],
  ManageMonitor_getWatchlistHitGridByUserId: [
    {
      role: RoleEnum.AGENT,
      args: { userId: defaultGuid },
    },
  ],
  ManageMonitor_getAllowedAddressbookDomainGrid: [
    { role: RoleEnum.COMPLIANCE_ADDRESSBOOK },
  ],
  ManageMonitor_getTransferClassifierKnownAtProcessingGrid: [
    { role: RoleEnum.AUDIT_TRANSACTION },
  ],
  ManageMonitor_getUserIdentityRequestGrid: [{ role: RoleEnum.COMPLIANCE_ID }],
  ManageMonitor_getListLexisGrid: [{ role: RoleEnum.COMPLIANCE_SANCTIONLIST }],
  ManageUser_getCorporateEntity: [
    { role: RoleEnum.AGENT, args: { userId: defaultGuid } },
  ],
  ManageUser_getCorporateEntityGrid: [{ role: RoleEnum.AUDIT_USER }],
  ManageMonitor_getCorporatePersonOfInterestGrid: [
    { role: RoleEnum.AUDIT_USER },
  ],
  ManageMonitor_getCorporatePersonOfInterestGridByUserId: [
    {
      role: RoleEnum.AGENT,
      args: { userId: defaultGuid },
    },
  ],
  ManageUser_getAddressbookGridByUserId: [
    {
      role: RoleEnum.AGENT,
      args: { userId: defaultGuid },
    },
  ],
  ManageUser_getAddressbookGrid: [{ role: RoleEnum.COMPLIANCE_ADDRESSBOOK }],
  ManageMonitor_getFiuNotificationGrid: [{ role: RoleEnum.COMPLIANCE_FIU }],
  ManageAffiliate_getCustomCode: [
    {
      role: RoleEnum.AFFILIATE,
      args: { customCode: fixedCustomCodeId },
      version: 2,
    },
  ],
  ManageAffiliate_getCustomCodeGrid: [{ role: RoleEnum.AFFILIATE, version: 2 }],
  ManageStaking_getBoxedOutRewardRateGrid: [
    {
      role: RoleEnum.MANAGEMENT,
      version: 2,
    },
  ],
  ManageStaking_getBoxedOutRewardRate: [
    {
      role: RoleEnum.MANAGEMENT,
      args: { RewardID: '1' },
      version: 2,
    },
  ],
  ManageStaking_getUserRewardRateGrid: [
    {
      role: RoleEnum.MANAGEMENT,
      version: 2,
    },
  ],
  ManageStaking_getUserRewardRate: [
    {
      role: RoleEnum.MANAGEMENT,
      args: { assetHold: AssetCodeEnum.SHIB },
      version: 2,
    },
  ],
  ManageCrypto_getDepositGlobalGrid: [
    { role: RoleEnum.AGENT, version: 2 },
    {
      role: RoleEnum.AGENT,
      args: { cryptoAsset: { value: AssetCodeEnum.XLM.toUpperCase() } },
      version: 2,
    },
  ],
  ManageMonitor_getUserRiskProfileScore: [
    {
      role: RoleEnum.AUDIT_TRANSACTION,
      args: { userId: defaultGuid },
    },
  ],
  ManageUser_getUserCompensateGrid: [
    {
      role: RoleEnum.SHIFT_LEAD,
      version: 2,
    },
  ],
  ManageMonitor_getRefundCustomerGrid: [
    {
      role: RoleEnum.SHIFT_LEAD,
      version: 2,
    },
  ],
  ManageMonitor_getUserTagGridByUserId: [
    {
      role: RoleEnum.AGENT,
      args: { userId: defaultGuid },
    },
  ],
  ManageUser_getUserFileGrid: [
    {
      role: RoleEnum.AGENT,
      args: { userId: defaultGuid },
      version: 2,
    },
  ],
  ManageUser_getUserFile: [
    {
      role: RoleEnum.AGENT,
      args: { ID: '1' },
    },
  ],
  ManageCrypto_getCryptoWithdrawalStuckGrid: [
    {
      role: RoleEnum.USER_WITHDRAWAL_MANAGE,
      version: 2,
    },
  ],
  ManageMetaData_getStuckWithdrawalMetaGrid: [
    {
      role: RoleEnum.USER_WITHDRAWAL_APPROVE,
      version: 2,
    },
  ],
  ManageUser_getUserAddress: [
    {
      role: RoleEnum.AGENT,
      args: { userId: defaultGuid },
      version: 2,
    },
  ],
};
const introspectionQuery = `
  query IntrospectionQuery {
    __schema {
      queryType { name, fields { name } }
      mutationType { name }
      subscriptionType { name }
      types {
        ...FullType
      }
      directives {
        name
        description
        locations
        args {
          ...InputValue
        }
      }
    }
  }
  fragment FullType on __Type {
    kind
    name
    description
    fields(includeDeprecated: true) {
      name
      description
      args {
        ...InputValue
      }
      type {
        ...TypeRef
      }
      isDeprecated
      deprecationReason
    }
    inputFields {
      ...InputValue
    }
    interfaces {
      ...TypeRef
    }
    enumValues(includeDeprecated: true) {
      name
      description
      isDeprecated
      deprecationReason
    }
    possibleTypes {
      ...TypeRef
    }
  }
  fragment InputValue on __InputValue {
    name
    description
    type { ...TypeRef }
    defaultValue
  }
  fragment TypeRef on __Type {
    kind
    name
    ofType {
      kind
      name
      ofType {
        kind
        name
        ofType {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                }
              }
            }
          }
        }
      }
    }
  }
  `;

const queryToType = (query, introspection): string => {
  const queryTypeName =
    query.type.kind === 'NON_NULL' ? query.type.ofType.name : query.type;

  const queryType = introspection.__schema.types.find(
    (t) => t.name === queryTypeName,
  );
  if (queryType) {
    const nodes = queryType.fields.find((f) => f.name === 'nodes');
    if (nodes && nodes.type.kind === 'LIST') {
      return nodes.type.ofType.kind === 'NON_NULL'
        ? nodes.type.ofType.ofType.name
        : nodes.type.ofType.name;
    }
  }

  return queryTypeName;
};

// Gets all usable data from the introspection and returns it in the format:
// { Query: { fields: [...listOfQueries] }, typeA: { fields: [...fields], arg: singularGetArg }, typeB: ... }
const getDataFromIntrospection = (introspection: {
  [key: string]: any;
}): { [key: string]: any } => {
  const allResults = {};

  const _fieldsToSkip = [...fieldsToSkip];

  const queries = introspection.__schema.queryType.fields.map((q) => q.name);

  for (const item of introspection.__schema.types) {
    if (typeof allResults[item.name] === 'undefined') {
      allResults[item.name] = { fields: [] };
    }
    if ('fields' in item && item.fields instanceof Array) {
      for (const field of item.fields) {
        const ofType =
          field.type.kind === 'NON_NULL'
            ? field.type.ofType.kind
            : field.type.kind;

        if (
          field.name[0].toUpperCase() === field.name[0] &&
          !queries.includes(field.name) &&
          (ofType === 'OBJECT' || ofType === 'LIST')
        ) {
          _fieldsToSkip.push(field.name);
        } else if (!_fieldsToSkip.includes(field.name)) {
          allResults[item.name].fields.push(field);
        }

        // Get the arg of singular queries
        if (
          item.name === 'Query' &&
          !field.name.includes('Grid') &&
          !_fieldsToSkip.includes(field.name)
        ) {
          const resourceType = queryToType(field, introspection);
          if (typeof allResults[resourceType] === 'undefined') {
            allResults[resourceType] = { fields: [] };
          }
          allResults[resourceType].arg = field.args[0].name;
        }
      }
    }
  }
  return allResults;
};

// Since Query is at the same level as every type, we need to create an index in the format:
// { queryName: { fields: [typeField1, typeField2, ...] arg: singularGetArg } }
const indexResults = (
  results: {
    [key: string]: any;
  },
  introspection: {
    [key: string]: any;
  },
): { [key: string]: any } => {
  const queries = {};
  for (const item of results['Query'].fields) {
    if (fieldsToSkip.includes(item.name)) continue;

    const typeName = queryToType(item, introspection);
    if (!(typeName in results)) {
      throw Error(
        'The type ' +
          typeName +
          ' created from ' +
          item.name +
          ' does not exist in our GraphQL type space.',
      );
    }
    queries[item.name] = {};
    queries[item.name] = results[typeName];
  }
  return queries;
};

// Here we convert the indexed data into actual queries, including the export const, so we can easily import them
const createQueryFromData = (queries: { [key: string]: any }): string[] => {
  const queryArray: string[] = [];
  for (const query in queries) {
    let index = 0;
    if (!(query in queryMap)) {
      console.error(
        'Query ' +
          query +
          ' is not available in the queryMap, please update queryMap in auto-tests.e2e-spec.ts with the correct role and args',
      );
    }
    for (const item of queryMap[query]) {
      const firstField = queries[query].fields[0].name;
      let endQuery;
      if (query.includes('Grid')) {
        const colId = item.version === 2 ? firstField : `"${firstField}"`;
        endQuery = `export const ${query}_${index} = \`query {\n${query}(\nstartRow: 0\nendRow: 20\nsorting: [ { colId: ${colId}, sort: ASC } ]\n${printArgs(
          item.args,
        )}\n) {\nnodes{\n`;
      } else {
        endQuery = `export const ${query}_${index} = \`query {\n${query}(${printArgs(
          item.args,
        )}\n){\n`;
      }

      for (const field of queries[query].fields) {
        endQuery = `${endQuery}${field.name}\n`;
      }

      if (query.includes('Grid')) {
        endQuery = `${endQuery}}\n`;
      }

      endQuery = `${endQuery}}\n}\`;\n`;
      queryArray.push(endQuery);
      index += 1;
    }
  }
  return queryArray;
};

// Writes the created queries to the file
const writeToFile = (queries: string[]): void => {
  let first = true;
  for (const query of queries) {
    if (first) {
      first = false;
      writeFileSync(join(__dirname, `/queries.ts`), query);
    } else {
      appendFileSync(join(__dirname, `/queries.ts`), query);
    }
  }
};

const createAutomatedTests = async (
  app: NestFastifyApplication,
): Promise<{ [key: string]: any }> => {
  const res = await request(app.getHttpServer()).post('/graphql').send({
    operationName: null,
    query: introspectionQuery,
  });
  const data = getDataFromIntrospection(res.body.data);
  const indexedData = indexResults(data, res.body.data);
  return indexedData;
};

const areFieldsEqual = (
  result: { [key: string]: any },
  indexedData: { [key: string]: any },
  queryAlias: string,
): boolean => {
  if (typeof result.data === 'undefined' || result.data === null) {
    throw new Error(
      `the result of your query ${queryAlias} is undefined: ${JSON.stringify(
        result,
      )}`,
    );
    // console.error('the result of your query is undefined:', result);
    // return;
  }
  if (!result.data) {
    console.log(result);
  }
  const queryName = Object.keys(result.data)[0];
  let data = result.data[queryName];
  // If the returned item is a list, only check the first entry
  if (queryName.includes('Grid')) {
    data = data.nodes?.[0];
  }
  if (!data) {
    console.error(
      `data is undefined for query ${queryName}, please make sure the testingEntry is set correctly`,
    );
  }
  if (Object.keys(data).length !== indexedData[queryName].fields.length) {
    console.error(
      `The fields are not equal, \n got: ${Object.keys(data)} \n wanted: ${
        indexedData[queryName].fields
      }`,
    );
    return false;
  } else {
    let index = 0;
    for (const field of Object.keys(data)) {
      if (field !== indexedData[queryName].fields[index].name) {
        console.error(
          'fields did not coincide got:',
          field,
          'wanted:',
          indexedData[queryName].fields[index].name,
        );
        return false;
      }
      index += 1;
    }
  }
  return true;
};

// This function cuts the index from the end (since we don't have index in introspection)
// Will also remove duplicates (meaning we only check if each endpoint has at least 1 query)
const getOriginalQueryNamesFromStorage = (queryStorage) => {
  const queries = Object.keys(queryStorage);
  const returnArray = [];
  for (const query of queries) {
    const queryName = query.substring(0, query.lastIndexOf('_'));
    if (returnArray.indexOf(queryName) === -1) {
      returnArray.push(queryName);
    }
  }
  return returnArray;
};

describe(`queries/${getTestFilename(__filename)} : Auto e2e tests`, () => {
  let app: NestFastifyApplication;
  let loginApp: NestFastifyApplication;
  let indexedData: { [key: string]: any };
  const roleJwts: { [key: string]: string } = {};

  beforeAll(async () => {
    loginApp = await initApp(UserProviderModule.forRoot({ onlyAuth: true }));

    app = await initApp(ManagePanelModule.forRoot());
    indexedData = await createAutomatedTests(app);
  });

  afterAll(async () => {
    if (UPDATE_QUERIES) {
      const newQueries = createQueryFromData(indexedData);
      writeToFile(newQueries);
      console.log('done writing queries to queries.ts');
    }
    loginApp && (await loginApp.close());
    return app && (await app.close());
  });

  it('should have the same amount of queries as before', () => {
    expect(indexedData).toBeDefined();

    // must have same queries than before
    expect(getOriginalQueryNamesFromStorage(queryStorage)).toEqual(
      Object.keys(indexedData),
    );
  });

  const testQueryNameList: [string, string][] = [];
  for (const query in queryStorage) {
    const queryName = query.substring(0, query.lastIndexOf('_'));
    testQueryNameList.push([queryName, query]);
  }

  it.each(testQueryNameList)(
    'Should return the appropriate fields for %s',
    async (queryName, query) => {
      if (typeof queryMap[queryName] === 'undefined') {
        throw Error(
          `It looks like you forgot to add the role for this query ${query}, please check queryMap in auto-tests.e2e-spec.ts`,
        );
      }
      for (const item of queryMap[queryName]) {
        // For now chose to take a role at random when we specify ALL_ROLES,
        // Otherwise we would need to a lot of tests to test something rudimentary.
        const role = Array.isArray(item.role)
          ? faker.random.arrayElement(item.role)
          : item.role;

        // Check if we already have a JWT for that role, to avoid generating a new one
        if (role && !roleJwts[role]) {
          roleJwts[role] = await getJWT(loginApp, role);
        }

        const req = request(app.getHttpServer()).post('/graphql');

        if (role) {
          req.set('Authorization', roleJwts[role]);
        }

        return await req
          .send({
            operationName: null,
            query: queryStorage[query],
          })
          .expect(({ body }) => {
            if (body.data !== null) {
              expect(areFieldsEqual(body, indexedData, query)).toEqual(true);
            } else {
              // we have an error, print it
              console.error(query, body);
              console.error(queryStorage[query]);
              expect(body.data).not.toEqual(null);
              expect(body.errors).not.toBeDefined();
            }
          })
          .expect(200);
      }
    },
  );

  it.each(testQueryNameList)(
    'Should return an error with a not allowed role for %s',
    async (queryName, query) => {
      for (const item of queryMap[queryName]) {
        if (!item.role) return;

        const jwt = await getJWT(loginApp, RoleEnum.TEST);
        await request(app.getHttpServer())
          .post('/graphql')
          .set('Authorization', jwt)
          .send({
            operationName: null,
            query: queryStorage[query],
          })
          .expect(({ body }) => {
            const error = body.errors?.length
              ? body.errors[0].message
              : undefined;
            expect(body.data).toEqual(null);
            expect(error).toEqual(ErrorsEnum.FORBIDDEN_RESOURCE);
          })
          .expect(200);
      }
    },
  );
});

function printArgs(
  args: { [key: string]: string | { value: string } } | undefined,
): string {
  let toRet = '';
  if (args) {
    for (const arg in args) {
      if (typeof args[arg] !== 'string') {
        const obj = args[arg] as { value: string };
        toRet = `${toRet}\n${arg}:${obj.value}`;
      } else {
        toRet = `${toRet}\n${arg}:"${args[arg]}"`;
      }
    }
  }
  return toRet;
}
