import { InputType, ObjectType, PartialType, PickType } from '@nestjs/graphql';
import AgGridGqlType from '@nestjs-yalc/ag-grid/ag-grid.type';
import { UserFile } from '@boxedout-libs/db-boxedout';
import {
  AgGridField,
  AgGridObject,
} from '@nestjs-yalc/ag-grid/object.decorator';

@AgGridObject()
@ObjectType()
export class UserFileType extends UserFile {
  @AgGridField({
    gqlOptions: {
      name: 'userId',
      nullable: true,
    },
  })
  guid: string;
}

@AgGridObject()
@ObjectType()
export class UserFileGrid extends AgGridGqlType<UserFileType>(UserFileType) {}

/**
 * Here all the input type for Graphql
 */
@InputType()
@AgGridObject({
  copyFrom: UserFileType,
})
export class UserFileInput extends PartialType(
  PickType(UserFileType, ['xx']),
  InputType,
) {}
