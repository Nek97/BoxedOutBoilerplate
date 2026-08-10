Rev: 3.2.1-rc1.119
=============
 ### Fixed
- Performance issue with dashboard endpoint v1
- Added new coin in balanceCheck list



Rev: 3.2.1-rc1.118
=============
 ## Changed

* Fixes for the trade value for recived and paid amount

Rev: 3.2.1-rc1.117
=============
 ## Changed

* Added new coin EUROC to the list



Rev: 3.2.1-rc1.116
=============
 



Rev: 3.2.1-rc1.114
=============
 ### Updated
- Changed alert comment trigger, using entityCategory instead of entityName
- Using last index instead of the hardcoded one to fetch some information
- Changed the string, now the type (direct\indirect) is inside braces



Rev: 3.2.1-rc1.113
=============
 



# Rev: 3.2.1-rc1.112

## [BOB-6259](https://app.clickup.com/t/2566449/BOB-6259) - [BOB-7097](https://app.clickup.com/t/2566449/BOB-7097)

### Added

- tags added:
  Dissemination-notification
  Arbitrage-trader
  FIU-Information-request
  Information-request
  Seizure
  Risk-scam-victim-confirmed
  Risk-scam-hack
  Risk-crime-perpetrator

### Removed

- tags removed:
  skip-cumulative-atm
  skip-cumulative-darknet
  skip-cumulative-gambling
  skip-cumulative-high-risk-exchange
  skip-cumulative-mixing
  skip-cumulative-peer-to-peer
  skip-cumulative-ransomware
  skip-cumulative-scam
  skip-cumulative-stolen-funds
  skip-laundering

# Rev: 3.2.1-rc1.111

### Changed

- IdentityManagerClientService now includes the Bearer JWT, User-Agent and X-Forwarded-For when calling the API.
- Changed UserEmailController and UserPasswordController to capture the headers and send it to the service layer

# Rev: 3.2.1-rc1.107

# Rev: 3.2.1-rc1.106

# Rev: 3.2.1-rc1.105

## [BOB-6731](https://app.clickup.com/t/2566449/BOB-6731)

### Added

- monitor shared logic (related to triggers) is inside monitor/common.js

### Updated

- added triggers in the return

# Rev: 3.2.1-rc1.104

### Changed

- GET UserIdentityDocument: retrieve the document ID by xx and not by guid

# Rev: 3.2.1-rc1.103

## [PAY-1236](https://app.clickup.com/t/2566449/PAY-1236)

## Added

- backend-payments url in K8S .yaml and replaced the SELECT with a axios get request via a class.
- Some extra logic because there needs to be a total count of addresses externalCounter, it still does the fetchQueries.push on every iteration. Not sure if that should also move to that else, might be obsolete.

## Chore

- Added back the code from [the previous PR ](https://github.com/boxedout/boxed-out-boilerplate/pull/553)

# Rev: 3.2.1-rc1.101

## [BOB-7087](https://app.clickup.com/t/2566449/BOB-7087)

### Changed

- UserLogs view: changed device token to device name
- UserLogs view: changed user agent to a fancier name

# Rev: 3.2.1-rc1.100

# Rev: 3.2.1-rc1.97

## [WEB-2457](https://app.clickup.com/t/2566449/WEB-2457)

## Removed

- Disable id_approved email

# Rev: 3.2.1-rc1.95

## [PAY-1236](https://app.clickup.com/t/2566449/PAY-1236)

## Added

- backend-payments url in K8S .yaml and replaced the SELECT with a axios get request via a class.
- Some extra logic because there needs to be a total count of addresses externalCounter, it still does the fetchQueries.push on every iteration. Not sure if that should also move to that else, might be obsolete.

# Rev: 3.2.1-rc1.94

## [BOB-7069](https://app.clickup.com/t/2566449/BOB-7069)

### Fixed

- Refund select only available or inOrder balance

# Rev: 3.2.1-rc1.92

## [BOB-6941](https://app.clickup.com/t/2566449/BOB-6941)

### Added

- function setRestResponse to set the response status always on 200 for the legacy endpoints
- function isMobileRequest to identify request from the App

### Changed

- userAddress rest api response code can be 400/403 for the app
- function convertCookies now is in the common library

# Rev: 3.2.1-rc1.83

## [BOB-6628](https://app.clickup.com/t/2566449/BOB-6628)

### Added

- Backend-Manage repository (v2) into Core-Api

# Rev: 3.2.1-rc1.82

## Changed

- Added new coins to the list

# Rev: 3.2.1-rc1.80

## Changes

- Renamed missing classes and variables from AuthProvider to UserProvider
- Updated architecture diagram

# Rev: 3.2.1-rc1.79

# [FAVO-3866](https://app.clickup.com/t/2566449/FAVO-3866)

### Added

- Migration to create IMX, ENS, OP, XYO, PAXG, DYDX assets tables

# Rev: 3.2.1-rc1.78

### Fixed

- Multiple account lock: search for internal account

# Rev: 3.2.1-rc1.77

### Added

- New endpoint that updates the user email in auth0 or internal database.

# Rev: 3.2.1-rc1.76

## Features

- add swagger support to the app bootstrap to start documenting NestJS rest controllers
- some documentation improvements

# Rev: 3.2.1-rc1.73

We want to rename the service, once used only to expose the login and endpoints, to the user-provider that will host all the endpoints of the user domain. This in order to avoid confusion on where to create files related to the user-domain-

NOTES:

- the user-domain endpoints should be moved out of the service and placed into the
- the user-provider itself will be refactored with the boundary contexts of the DDD in future and probably moved on different repository
- all the other domains should follow the same approach above

## Changes

- rename in

# Rev: 3.2.1-rc1.72

This PR aims to improve the local installation process by introducing new default files as well as giving the possibility to define new user generated ones based on the NODE_ENV. It also includes some code cleanup and the upgrade of library which comes with the new jest 27. The upgrade of Jest also required many adjustments to our tests by fixing some async issues.

Part 2 will include documentation and the skeleton module adjustment to improve the BCA onboarding

## Changes

- Improved environment files handling by introducing both and user specified dynamic extensions

- Improved local installation process by providing default env and adjusted Unknown command: "scripts"

To see a list of supported npm commands, run:
npm help

- fix: package.json deprecations

- Disabled sls pipeline jobs

- fix: jest async error - not closed promises

- fix: audit logs are now async and awaited

- fix: redis connection closing gracefully

- fix: generate crypto-withdrawal-stuck with proper date for the tests

- Upgraded nestjs-yalc submodule, it includes fixes to the ag-grid fields and jest upgraded to v27

- pipeline test with

- some minor fixes

# Rev: 3.2.1-rc1.66

### Fixed

- Fixed reload app in production
- Improved select performance for hash column in userId

### Added

- New email template type + translations

### Changed

- Changed lock type when a users has already an account (multiple-account-lock)

# Rev: 3.2.1-rc1.63

### Fixed

- Included the auth0 env variables to be used in development on .env.development.
- Changed app-imports.factory.ts to load them in any dev environment

# Rev: 3.2.1-rc1.62

## Added

- Identity Manager Client Module with change user password consumer
- JwtAuth0Strategy to authenticate Auth0 users.
- UserPasswordController with the change users endpoint on auth-provider

## Changed

- RestAuthGuard now authenticates Auth0 or Internal user tokens. Both are accepted.
- Changed the testingEntry user created in the database seeding to have a fixed active and unlocked account.

# Rev: 3.2.1-rc1.61

Added config for the new luna LUNA2

# Rev: 3.2.1-rc1.60

# [FAVO-4138](https://app.clickup.com/t/2566449/FAVO-4138)

### Added

- migration for new LUNA2 coin

# Rev: 3.2.1-rc1.59

## [BOB-6695](https://app.clickup.com/t/2566449/BOB-6695)

### Changed

- Jwt public strategy now can validate web and app token

# Rev: 3.2.1-rc1.56

# Rev: 3.2.1-rc1.55

## [BOB-6695](https://app.clickup.com/t/2566449/BOB-6695)

### Changed

- Now the App can use the Mobile token to verify the request

# Rev: 3.2.1-rc1.50

## [BOB-6285](https://app.clickup.com/t/2566449/BOB-6285)

### Added

- New modular logger to set log levels per each module where it's used
- Verification timer for refund and compensate

### Changed

- Logger refactoring
- Updated libs/common submodule

# Rev: 3.2.1-rc1.49

# Rev: 3.2.1-rc1.37

## [BOB-6580](https://app.clickup.com/t/2566449/BOB-6580)

### Added

- New kafka-user module
- Controller for userId kafka topic
- Endpoint ( only test ) for new user lock logic
- New user lock logic
- Migration for new columns in userId
- Added Bcrypt as hashing library + as

# Rev: 3.2.1-rc1.36

# Rev: 3.2.1-rc1.35

This PR adds documentation on how to create a CRUD lib for this project
It also includes several minor improvements

## Added

- Documentation on how to create endpoints with AgGrid system
- Implemented TYPEORM_CREATE_DB var to avoid db creation with
  > boxedout-core-api@3.2.1-rc1.35 start:dev
  > cross-var nest start --watch $npm_config_bcaproj --
- Created skeleton-boxedout-module

## Changed

- fix tsconfig for build and jest
- Allow to seed only databases related to the selected project
- Gateway now exposes REST API methods properly
- Improved seed logs
- updated nestjs-yalc to the last version

# Rev: 3.2.1-rc1.34

## Hotfix

### Fixed

- Add process.exit on app failure for restarting pod in K8S

# Rev: 3.2.1-rc1.33

Hotfix/user address controller

# Rev: 3.2.1-rc1.32

## [BOB-6587](https://app.clickup.com/t/2566449/BOB-6587)

### Added

- Update Api for user - userAddress
- coverage for user module

# Rev: 3.2.1-rc1.31

## [BOB-6103](https://app.clickup.com/t/2566449/BOB-6103)

### Added

- CRUD Gql for monitoring - userAddress
- CRUD Gql for user - userAddress
- C.R. Api for user - userAddress
- AuditUserLog - To log user actions into the db
- AuthRest Decorator
- Created BadRequestError - new error handler

### Changed

- UserResolver - added userAddress as a nested resource
- GeneralResolver now can access to the request's context
- Added ExtraArgs & ExtraInputs in the GeneralResolver
- AuthModule is no more using different connection's names
- Possibility to use named connection into the AuthModule application during the tests
- Added HttpCtx functions in the request-context-helper file

# Rev: 3.2.1-rc1.28

## [BOB-6105](https://app.clickup.com/t/2566449/BOB-6105)

### Added

- Scheduler job for locking with the users that has been already block with
- Add new logic for
- Migration for new tag

### Changed

- Moved logic of multiple-account-lock and boxedout-lock under monitor-user
- Put the logic locking into a new service
- Tag name from of to

### Removed

- Cleaned up the files in monitor-user folder

# Rev: 3.2.1-rc1.27

## [BOB-6316](https://app.clickup.com/t/2566449/BOB-6316)

### Added

- Migration to change xx column from int(32) to string (uuid)
- Migration on AdminMetadata to change PK

### Changed

- Changed name fields in DTO
- Now every time a change status on stuckCryptoWithdrawal happened we update the column

### Fixed

- Error handling on Kafka-App to avoid autocommit

# Rev: 3.2.1-rc1.26

### Fixed

- Kafka-App pipeline name
- Moved skipchecks into dryrun too

# Rev: 3.2.1-rc1.25

## [BOB-6046](https://app.clickup.com/t/2566449/BOB-6046)

### Added

- for all list of comments type we handle
- for all the list of tags we handle
- New endpoint for lock/unlock a duplicate account + boxedout lock
- New endpoint for lock/unlock multiple duplicate account + boxedout lock
- Migration for new tag

# Rev: 3.2.1-rc1.17

## [BOB-5944](https://app.clickup.com/t/2566449/BOB-5944)

### Added

- Migration to delete a questionnaire option
- Migration to update a questionnaire option

# Rev: 3.2.1-rc1.16

### Added

- migration to add missing column in new assets tables
- migration to configure new asset networks
- migration to fix decimals to 18

# Rev: 3.2.1-rc1.15

# [FAVO-3772](https://app.clickup.com/t/2566449/FAVO-3772)

## Added

Added config for next batch of new coins
ICP
FLOW
STX
EGLD
THETA
KLAY
BTT
RUNE
CELO
GALA
AMP
CVX
RNDR
WOO
APE

# Rev: 3.2.1-rc1.11

## [BOB-6261](https://app.clickup.com/t/2566449/BOB-6261)

### Added

- Add switch bucket for fetching the correct s3 file

# Rev: 3.2.1-rc1.8

# Fix

### Added

- migration to add RNDR databases/tables (fixed previous dump)

# Rev: 3.2.1-rc1.3

## [BOB-5824](https://app.clickup.com/t/2566449/BOB-5824)

### Added

- New application for Kafka + Debezium
- Docker Compose with Kafka + Debezium + Schema-Registry
- Endpoint for Stuck Crypto Withdrawal
- 4-eye verification process for Stuck Crypto Withdrawal
- ExtraArgs with fixed filter for the query at runtime

### Fixed

- DateField Type
- Filter conditions in FindManyOptions for Date
- join field has only JoinType

# Rev: 3.1.0-rc1.45

## [BOB-6120](https://app.clickup.com/t/2566449/BOB-6120)

### Added:

- migration to add column failedChecks into boxedoutAdmin.monitorAssets and boxedoutAdmin.monitorFiat

### Changed:

- monitorFiat and monitorAsset: entities and factories can handle new column

# Rev: 3.1.0-rc1.43

### Added

- comand git:sub to install submodules

# Rev: 3.1.0-rc1.42

# [FAVO-3772](https://app.clickup.com/t/2566449/FAVO-3772)

### Added

- migration to change CRO name
- migration for 14 new coins

# Rev: 3.1.0-rc1.35

## [BOB-5673](https://app.clickup.com/t/2566449/BOB-5673)

### Added:

- ManageUser_getUserFileGrid, ManageUser_getUserFile and ManageUser_deleteUserFile endpoints
- userFile dataloader to getUser

### Changed:

- Refactored getFileFromS3 transformer, also used in UserIdentity

# Rev: 3.1.0-rc1.34

# [FAVO-3443](https://app.clickup.com/t/2566449/FAVO-3443)

### Added

- Migration to add table for app reviews

# Rev: 3.1.0-rc1.33

# [FAVO-3708](https://app.clickup.com/t/2566449/FAVO-3708)

### Changed

- Removed GRANTs from migration

# Rev: 3.1.0-rc1.32

# [FAVO-3708](https://app.clickup.com/t/2566449/FAVO-3708)

### Added

- Migration to create ATOM, CRO, HBAR, NEAR tables
- [Support for following coins: LUNA, CRO, HBAR, ATOM, NEAR](FAVO-3708/added-support-for-new-coins)

![Screenshot from 2022-03-16 22-34-09](https://user-images.githubusercontent.com/15654904/158694937-d7efaea0-5042-4d2a-bdae-7e979036b1f7.png)

# Rev: 3.1.0-rc1.30

Ontology release notes:
https://github.com/ontio/ontology/releases/tag/v2.3.5

> increase ONT/ONG decimals from 0/9 to 9/18.

# Rev: 3.1.0-rc1.28

## K8S deployment integration

## Features

- commit directly to k8s-config repo to deploy
- Implemented dev-migrations to seed users via typeorm-migrations enabled with the env variable TYPEORM_CUSTOM_DEV_MIGRATIONS

## Changed

- fix permissions related to the Dockerfile npm isntall
- use boolean type for the workflows inputs

## ToDo

- remove AWS serverless support once the migration is 100% completed

# Rev: 3.1.0-rc1.24

## Hotfix

### Added

- defaultDateTransformer: add a new date as default when the date is not provided

### Fixed

- When a comment_tag was entered, all comments were hidden

# Rev: 3.1.0-rc1.23

### Change:

- added getBankAccountByUserId query to retrieve single items

# Rev: 3.1.0-rc1.22

## [BOB-5618](https://app.clickup.com/t/2566449/BOB-5618)

### Changed

- update userTag service test
- update ManageMonitor_getUserTagGridByUserId to the V2 of endpoints

### Added

- ManageMonitor_updateTags to add/remove tags and place a comment

# Rev: 3.1.0-rc1.21

# Rev: 3.1.0-rc1.20

### Added

- Migration for new tag on boxedoutAdmin.tagLIst

# Rev: 3.1.0-rc1.19

## [BOB-5850](https://app.clickup.com/t/2566449/BOB-5850)

### Changed

- ManageMonitor_getFiuNotificationGrid query now can return up to 501 rows

# Rev: 3.1.0-rc1.17

## apiPrefix fix

### Fixes

- apiPrefix option was not working properly due to some missing conf
- add prefix information within the console.log at app listening

# Rev: 3.1.0-rc1.16

## Implemented REST auto-generation with GraphQL SOFA

### Feature

- Implemented generation of REST API by using GraphQL Sofa and custom algorithm to normalize and standardize the paths. This needed also to wrap the schema and remove all the nested resources to avoid a bug with circular dependency in GraphQL Sofa lib.

- Implemented SwaggerUI support with OpenAPI

# Rev: 3.1.0-rc1.15

### Added

- New permissions for db assets to core-api

### Fixed

- Permission query fix by adding ON clause

# Rev: 3.1.0-rc1.13

## [BOB-5583](https://app.clickup.com/t/2566449/BOB-5583)

### Features

- All markdown files are now rendered by the [git-wiki](http://www.drassil.org/git-wiki/main_page) theme
- Added instructions, alternatively to the

### Fixes

- Readme links now work on both github and github-pages
- Fixed some links in other documentation pages (still in WIP)

### Changed

- Removed additional documentation from compodoc. Now it only shows auto-generated documentation
- Updated compodoc to the latest version

**TODO:**

Disable edit feature of the wiki theme

# Rev: 3.1.0-rc1.11

## [BOB-4411](https://app.clickup.com/t/2566449/BOB-4411)

### Features

- ManageMonitor_getRefundCustomerGrid query
- ManageMonitor_requestRefundCustomer mutation
- ManageMonitor_verifyRefundCustomer mutation
- refundCustomer1642077396126 migration
- e2e test to test correct flow
- e2e test to test wrong flow
- e2e test with queries
- mocked service to get prices in dev
- seed BTC and EUR tables in userBalance db
- index file for the userBalance db library
- throwWrap, a function to avoid multiple wraps around an error

### Changed

- userBalance index now export also the entity list for a clear code
- added the primary column in some entities where it was missing

# Rev: 3.1.0-rc1.10

Hotfix(boxedout-libs): migration boxedoutAdmin.translations

# Rev: 3.1.0-rc1.9

## [BOB-5569](https://app.clickup.com/t/2566449/BOB-5569)

### Added

- Migration for adding new tag in boxedoutAdmin.tagList (color 🟢)

# Rev: 3.1.0-rc1.7

# [BOB-5698](https://app.clickup.com/t/2566449/BOB-5698)

## Features

- Implemented CLI_MIGRATION_PAYLOAD env variable to setup the migration payload
- implemented gh-version-bump workflow to trigger an action that generates a changelog and upgrade the package version
