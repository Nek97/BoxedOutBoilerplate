import { ObjectType } from '@nestjs/graphql';
import AgGridGqlType from '@nestjs-yalc/ag-grid/ag-grid.type';
import { FieldMapper } from '@nestjs-yalc/interfaces/maps.interface';
import { UserEmail } from '@boxedout-libs/db-boxedout/entities/user-email.entity';

//This map is used to translate incoming request from
//GraphQL to the actual DB field

export const UserEmailFieldMap: FieldMapper = {
  userId: { dst: 'guid' },
  xx: { dst: 'xx', isRequired: true },
  // ID: { dst: 'databaseKey', isRequired: true },
};

@ObjectType()
export class UserEmailType extends UserEmail {}

@ObjectType()
export class UserEmailGrid extends AgGridGqlType<UserEmailType>(
  UserEmailType,
) {}
