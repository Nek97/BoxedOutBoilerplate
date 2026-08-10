// @ts-nocheck
import { AgGridRepository } from '@nestjs-yalc/ag-grid/ag-grid.repository';
import { EntityRepository, Repository } from 'typeorm';

import { TradingSignal } from './entities/trading-signal.entity';
import { BotExecutionLog } from './entities/bot-execution-log.entity';
import { MarketTick } from './entities/market-tick.entity';

import { ActiveSession } from './entities/active-session.entity';
import { Addressbook } from './entities/addressbook.entity';
import { AdminLog } from './entities/admin-log.entity';
import { UserDevice } from './entities/user-device.entity';
import { UserEmail } from './entities/user-email.entity';
import { UserLog, UserLogGlobal } from './entities/user-log.entity';
import { UserMobileDevice } from './entities/user-mobile-device.entity';
import { UserPhone } from './entities/user-phone.entity';
import { UserProofOfFunds } from './entities/user-proof-of-funds.entity';
import { UserQuestionnaire } from './entities/user-questionnaire.entity';
import { User } from './entities/user.entity';
import {
  UserIdentityDocument,
  UserIdentityDocumentGlobal,
} from './entities/user-identity-document.entity';
import { UserFile } from './entities/user-file.entity';
import { UserAddress } from './entities/user-address.entity';

@EntityRepository(ActiveSession)
export class ActiveSessionRepository extends AgGridRepository<ActiveSession> {}

@EntityRepository(Addressbook)
export class AddressbookRepository extends AgGridRepository<Addressbook> {}

@EntityRepository(AdminLog)
export class AdminLogRepository extends AgGridRepository<AdminLog> {}

@EntityRepository(UserAddress)
export class UserAddressRepository extends AgGridRepository<UserAddress> {}

@EntityRepository(UserFile)
export class UserDocumentRepository extends AgGridRepository<UserFile> {}

@EntityRepository(UserDevice)
export class UserDeviceRepository extends AgGridRepository<UserDevice> {}

@EntityRepository(UserEmail)
export class UserEmailRepository extends AgGridRepository<UserEmail> {}

@EntityRepository(UserIdentityDocument)
export class UserIdentityDocumentRepository extends AgGridRepository<UserIdentityDocument> {}

@EntityRepository(UserIdentityDocumentGlobal)
export class UserIdentityDocumentGlobalRepository extends AgGridRepository<UserIdentityDocumentGlobal> {}

@EntityRepository(UserLog)
export class UserLogRepository extends AgGridRepository<UserLog> {}

@EntityRepository(UserLogGlobal)
export class UserLogGlobalRepository extends AgGridRepository<UserLogGlobal> {}

@EntityRepository(UserMobileDevice)
export class UserMobileDeviceRepository extends AgGridRepository<UserMobileDevice> {}

@EntityRepository(UserPhone)
export class UserPhoneRepository extends AgGridRepository<UserPhone> {}

@EntityRepository(UserProofOfFunds)
export class UserProofOfFundsRepository extends AgGridRepository<UserProofOfFunds> {}

@EntityRepository(UserQuestionnaire)
export class UserQuestionnaireRepository extends AgGridRepository<UserQuestionnaire> {}

@EntityRepository(User)
export class UserRepository extends AgGridRepository<User> {}

@EntityRepository(UserFile)
export class UserFileRepository extends AgGridRepository<UserFile> {}

@EntityRepository(TradingSignal)
export class TradingSignalRepository extends Repository<TradingSignal> {}

@EntityRepository(BotExecutionLog)
export class BotExecutionLogRepository extends Repository<BotExecutionLog> {}

@EntityRepository(MarketTick)
export class MarketTickRepository extends Repository<MarketTick> {}
