// @ts-nocheck
import { FiuNotification } from '@boxedout-libs/db-fiuNotifications/entities/fiu-notification.entity';
import { AgGridRepository } from '@nestjs-yalc/ag-grid/ag-grid.repository';
import { EntityRepository } from 'typeorm';
import { AdminMetadata } from '.';

import { AllowedAddressbookDomain } from './entities/allowed-addressbook-domain.entity';
import { AllowedIp } from './entities/allowed-ip.entity';
import { Comment } from './entities/comment.entity';
import { LogAction } from './entities/log-action.entity';
import { LogView } from './entities/log-view.entity';
import { MonitorAsset } from './entities/monitor-asset.entity';
import { MonitorFiat } from './entities/monitor-fiat.entity';
import { Role } from './entities/role.entity';
import { Tag } from './entities/tag.entity';
import { TransferClassifierKnownAtProcessing } from './entities/transfer-classifier-known-at-processing.entity';
import { UserDynamic } from './entities/user-dynamic.entity';
import { UserIdentityRequest } from './entities/user-identity-request.entity';
import { UserIdentity } from './entities/user-identity.entity';
import { UserTag } from './entities/user-tag.entity';
import { WatchlistHit } from './entities/watchlist-hit.entity';

@EntityRepository(AllowedAddressbookDomain)
export class AllowedAddressbookDomainRepository extends AgGridRepository<AllowedAddressbookDomain> {}

@EntityRepository(AllowedIp)
export class AllowedIpRepository extends AgGridRepository<AllowedIp> {}

@EntityRepository(MonitorAsset)
export class MonitorAssetRepository extends AgGridRepository<MonitorAsset> {}

@EntityRepository(Comment)
export class CommentRepository extends AgGridRepository<Comment> {}

@EntityRepository(MonitorFiat)
export class MonitorFiatRepository extends AgGridRepository<MonitorFiat> {}

@EntityRepository(FiuNotification)
export class FiuNotificationRepository extends AgGridRepository<FiuNotification> {}

@EntityRepository(LogAction)
export class LogActionRepository extends AgGridRepository<LogAction> {}

@EntityRepository(LogView)
export class LogViewRepository extends AgGridRepository<LogView> {}

@EntityRepository(Role)
export class RoleRepository extends AgGridRepository<Role> {}

@EntityRepository(Tag)
export class TagRepository extends AgGridRepository<Tag> {}

@EntityRepository(TransferClassifierKnownAtProcessing)
export class TransferClassifierKnownAtProcessingRepository extends AgGridRepository<TransferClassifierKnownAtProcessing> {}

@EntityRepository(UserDynamic)
export class UserDynamicRepository extends AgGridRepository<UserDynamic> {}

@EntityRepository(UserIdentityRequest)
export class UserIdentityRequestRepository extends AgGridRepository<UserIdentityRequest> {}

@EntityRepository(UserIdentity)
export class UserIdentityRepository extends AgGridRepository<UserIdentity> {}

@EntityRepository(UserTag)
export class UserTagRepository extends AgGridRepository<UserTag> {}

@EntityRepository(WatchlistHit)
export class WatchlistHitRepository extends AgGridRepository<WatchlistHit> {}

@EntityRepository(AdminMetadata)
export class AdminMetadataRepository extends AgGridRepository<AdminMetadata> {}
