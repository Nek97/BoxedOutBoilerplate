import {
  IAppProjSetting,
  IOptions,
  jestConfGenerator,
} from './libs/common/jest/src/config/jest-conf.generator';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const NestCliProjects = require('./nest-cli.json');
export const nestProjects: { [key: string]: any } = NestCliProjects.projects;

const appProjectsSettings: { [key: string]: IAppProjSetting } = {
  all: {
    deps: [
      { name: 'all', path: 'apps' },
      { name: 'boxedout', path: 'libs/boxedout' },
      { name: 'boxedout-libs', path: 'libs/boxedout-libs' },
      { name: 'common', path: 'libs/common' },
    ],
    // confOverride: {
    //   coverageThreshold: {
    //     global: {
    //       branches: 90,
    //       functions: 90,
    //       lines: 90,
    //       statements: 90,
    //     },
    //   },
    // },
  },
  gateway: {
    deps: [
      { name: 'gateway', path: (nestProjects['gateway'] ? nestProjects['gateway'].root : "unknown-path") },
      {
        name: 'boxedout/manage-user',
        path: (nestProjects['boxedout/manage-user'] ? nestProjects['boxedout/manage-user'].root : "unknown-path"),
      },
      { name: 'boxedout/auth', path: (nestProjects['boxedout/auth'] ? nestProjects['boxedout/auth'].root : "unknown-path") },
      { name: 'boxedout-libs', path: 'libs/boxedout-libs' },
      { name: 'common', path: 'libs/common' },
    ],
  },
  'user-provider': {
    deps: [
      { name: 'user-provider', path: (nestProjects['user-provider'] ? nestProjects['user-provider'].root : "unknown-path") },
      {
        name: 'boxedout/manage-user',
        path: (nestProjects['boxedout/manage-user'] ? nestProjects['boxedout/manage-user'].root : "unknown-path"),
      },
      {
        name: 'boxedout/user',
        path: (nestProjects['boxedout/user'] ? nestProjects['boxedout/user'].root : "unknown-path"),
      },
      { name: 'boxedout/auth', path: (nestProjects['boxedout/auth'] ? nestProjects['boxedout/auth'].root : "unknown-path") },
      { name: 'boxedout-libs', path: 'libs/boxedout-libs' },
      { name: 'common', path: 'libs/common' },
    ],
  },
  'manage-panel': {
    deps: [
      { name: 'manage-panel', path: (nestProjects['manage-panel'] ? nestProjects['manage-panel'].root : "unknown-path") },
      {
        name: 'boxedout/manage-user',
        path: (nestProjects['boxedout/manage-user'] ? nestProjects['boxedout/manage-user'].root : "unknown-path"),
      },
      { name: 'boxedout/auth', path: (nestProjects['boxedout/auth'] ? nestProjects['boxedout/auth'].root : "unknown-path") },
      {
        name: 'boxedout/manage-monitor',
        path: (nestProjects['boxedout/manage-monitor'] ? nestProjects['boxedout/manage-monitor'].root : "unknown-path"),
      },
      {
        name: 'boxedout/manage-asset-value',
        path: (nestProjects['boxedout/manage-asset-value'] ? nestProjects['boxedout/manage-asset-value'].root : "unknown-path"),
      },
      {
        name: 'boxedout/manage-eur-wallet',
        path: (nestProjects['boxedout/manage-eur-wallet'] ? nestProjects['boxedout/manage-eur-wallet'].root : "unknown-path"),
      },
      {
        name: 'boxedout/manage-exchange',
        path: (nestProjects['boxedout/manage-exchange'] ? nestProjects['boxedout/manage-exchange'].root : "unknown-path"),
      },
      {
        name: 'boxedout/manage-crypto',
        path: (nestProjects['boxedout/manage-crypto'] ? nestProjects['boxedout/manage-crypto'].root : "unknown-path"),
      },
      {
        name: 'boxedout/manage-affiliate',
        path: (nestProjects['boxedout/manage-affiliate'] ? nestProjects['boxedout/manage-affiliate'].root : "unknown-path"),
      },
      {
        name: 'boxedout/manage-staking',
        path: (nestProjects['boxedout/manage-staking'] ? nestProjects['boxedout/manage-staking'].root : "unknown-path"),
      },
      {
        name: 'boxedout/skeleton-boxedout-module',
        path: (nestProjects['boxedout/skeleton-boxedout-module'] ? nestProjects['boxedout/skeleton-boxedout-module'].root : "unknown-path"),
      },
      { name: 'boxedout-libs', path: 'libs/boxedout-libs' },
      { name: 'common', path: 'libs/common' },
    ],
  },
  cli: {
    deps: [
      { name: 'cli', path: (nestProjects['cli'] ? nestProjects['cli'].root : "unknown-path") },
      { name: 'boxedout-libs', path: 'libs/boxedout-libs' },
      { name: 'common', path: 'libs/common' },
    ],
  },
  'kafka-app': {
    deps: [
      { name: 'kafka-app', path: (nestProjects['kafka-app'] ? nestProjects['kafka-app'].root : "unknown-path") },
      { name: 'boxedout-libs', path: 'libs/boxedout-libs' },
      {
        name: 'boxedout/kafka-crypto',
        path: (nestProjects['boxedout/kafka-crypto'] ? nestProjects['boxedout/kafka-crypto'].root : "unknown-path"),
      },
      { name: 'common', path: 'libs/common' },
    ],
  },
};

const options: IOptions = {
  skipProjects: [
    'libs/common/types',
    'libs/boxedout-libs/types-boxedout',
    'libs/common/graphql',
    'libs/boxedout/manage-v2',
  ],
  defaultCoverageThreshold: {
    branches: 0,
    functions: 0,
    lines: 0,
    statements: 0,
  },
  confOverrides: {
    'common/': {
      coverageThreshold: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
  },
};

const projectList: { [key: string]: string } = {};

Object.keys(nestProjects).map((k: string) => {
  const path: string = (nestProjects[k] ? nestProjects[k].root : "unknown-path");

  projectList[k] = path;
});

export default jestConfGenerator(
  __dirname,
  projectList,
  appProjectsSettings,
  options,
);
