// @ts-nocheck
/* istanbul ignore file */

import { ClassType } from '@nestjs-yalc/types';
import { AllowedIp } from './allowed-ip.entity';
import { Comment } from './comment.entity';
import { LogAction } from './log-action.entity';
import { LogView } from './log-view.entity';
import { LogViewTypeEnum } from './log-view.enum';
import { Provider } from './provider.entity';
import { Role } from './role.entity';
import { Tag } from './tag.entity';
import { TagColorEnum } from './tag.enum';
import { WatchlistHit } from './watchlist-hit.entity';

export const EntityList: () => ClassType[] = () => [
  AllowedIp,
  Comment,
  LogAction,
  LogView,
  Provider,
  Role,
  Tag,
  WatchlistHit,
];

export {
  AllowedIp,
  Comment,
  LogAction,
  LogView,
  Provider,
  Role,
  Tag,
  WatchlistHit,
};

export const EntityGlobalList: () => ClassType[] = () => [];

export const EntityEnumList = [
  LogViewTypeEnum,
  TagColorEnum,
];

export {
  LogViewTypeEnum,
  TagColorEnum,
};
