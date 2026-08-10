import { Directive, ObjectType } from '@nestjs/graphql';
import { IUserPayload } from '../jwt-private.strategy';

@ObjectType()
@Directive('@key(fields: "userId")')
export class UserSelfDataType implements Partial<IUserPayload> {
  userId: string;
  roleList?: string[];
  firstName?: string;
}
