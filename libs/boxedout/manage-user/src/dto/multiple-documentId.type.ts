/* istanbul ignore file */
import { InputType } from '@nestjs/graphql';
/**
 * Used only for local testing
 */

@InputType()
export class Test_UserIdInputType {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  documentNumber: string;
  isBoxedOut: boolean;
  isDeleted: boolean;
  isOffBoarded: boolean;
  withManual: boolean;
}

@InputType()
export class Test_UserInputType {
  isDeleted: boolean;
  isOffBoarded: boolean;
  guid: string;
  firstName: string;
  lastName: string;
}
@InputType()
export class MultipleDocumentIdInputType {
  xx: number;
}
