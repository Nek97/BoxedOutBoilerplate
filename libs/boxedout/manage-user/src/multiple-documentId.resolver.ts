/* istanbul ignore file */
import { RoleEnum } from '@boxedout-libs/shared/role.enum';
import { Auth } from '@boxedout/auth/auth.decorator';
import { InputArgs } from '@nestjs-yalc/ag-grid/gqlmapper.decorator';
import returnValue from '@nestjs-yalc/utils/returnValue';
import { Mutation, Resolver } from '@nestjs/graphql';
import { MultipleDocumentIdInputType } from './dto/multiple-documentId.type';
import { UserType } from './dto/user.type';
import { MultipleDocumentIdService } from './multiple-documentId.service';
import { UserIdentityDocumentService } from './user-identity-document.service';
import { UserService } from './user.service';

/**
 * The resolver is used only for testing the functionality. It will be replaced by Kafka
 */
@Resolver()
export class MultipleDocumentIdResolver {
  constructor(
    private multipleDocumentIdService: MultipleDocumentIdService,
    private userService: UserService,
    private userIdentityDocumentService: UserIdentityDocumentService,
  ) {}

  @Auth([RoleEnum.AGENT])
  @Mutation(returnValue(UserType))
  public async ManageUser_test_MultipleDocumentIdCheck(
    @InputArgs({
      fieldType: MultipleDocumentIdInputType,
    })
    input: MultipleDocumentIdInputType,
  ) {
    const document = await this.userIdentityDocumentService.getEntityOrFail(
      { xx: input.xx },
      ['guid', 'data'],
    );

    const { documentBaseDataHash, documentNumberHash } =
      await this.multipleDocumentIdService.extractDocumentInfo(document.data);

    await this.multipleDocumentIdService.applyChecks(
      document.guid,
      documentBaseDataHash,
      documentNumberHash,
    );

    return this.userService.getEntity({ guid: document.guid });
  }

  @Auth([RoleEnum.AGENT])
  @Mutation(returnValue(UserType))
  public async ManageUser_test_DocumentIdHashUpdate(
    @InputArgs({
      fieldType: MultipleDocumentIdInputType,
    })
    input: MultipleDocumentIdInputType,
  ) {
    const document = await this.userIdentityDocumentService.getEntityOrFail(
      { xx: input.xx },
      ['guid', 'data', 'xx'],
    );

    const { documentBaseDataHash, documentNumberHash } =
      await this.multipleDocumentIdService.extractDocumentInfo(document.data);

    await this.userIdentityDocumentService.updateEntity(
      { xx: document.xx },
      {
        documentBaseDataHash: documentBaseDataHash,
        documentNumberHash: documentNumberHash,
      },
    );

    return this.userService.getEntity({ guid: document.guid });
  }
}
