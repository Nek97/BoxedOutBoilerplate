// @ts-nocheck
import { AwsServiceType } from '@boxedout-libs/shared/enum';
import { isAwsServiceEnabled } from '@boxedout-libs/shared/helpers/aws.helper';
import {
  AgGridField,
  AgGridObject,
} from '@nestjs-yalc/ag-grid/object.decorator';
import { getFileFromS3 } from '@nestjs-yalc/aws-helpers';
import returnValue from '@nestjs-yalc/utils/returnValue';
import { ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  AfterLoad,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserFileTypeEnum } from './user-file.enum';

registerEnumType(UserFileTypeEnum, { name: 'UserFileTypeEnum' });

@Index('unique_file', ['referenceId', 'category', 'type'], { unique: true })
@Index('guid', ['guid'], {})
@Index('referenceId', ['referenceId'], {})
@Entity('userFile', { schema: 'boxedout' })
@ObjectType()
@AgGridObject()
export class UserFile {
  @AgGridField({
    gqlOptions: {
      name: 'ID',
    },
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'xx' })
  xx: number;

  @Column('int', { name: 'referenceId' })
  referenceId: number;

  @Column('varchar', { name: 'guid', length: 36 })
  guid: string;

  @Column('varchar', { name: 'category', length: 100 })
  category: string;

  @Column({
    name: 'type',
    type: 'enum',
    enum: UserFileTypeEnum,
    nullable: true,
  })
  type: UserFileTypeEnum;

  @Column({
    name: 'filePath',
    type: 'varchar',
    nullable: true,
    length: 250,
  })
  filePath: string;

  @Column('timestamp', {
    name: 'timestamp',
    default: returnValue('CURRENT_TIMESTAMP'),
  })
  timestamp: Date;

  @AfterLoad()
  async afterLoad(): Promise<void> {
    if (this.filePath) {
      const isAwsEnv = isAwsServiceEnabled(AwsServiceType.S3);
      switch (this.category) {
        case 'userIdentification':
          this.filePath =
            isAwsEnv && process.env.S3_BUCKET_ID
              ? await getFileFromS3(this.filePath, process.env.S3_BUCKET_ID)
              : this.filePath;
          break;
        default:
          this.filePath =
            isAwsEnv && process.env.S3_BUCKET_POF
              ? await getFileFromS3(this.filePath, process.env.S3_BUCKET_POF)
              : this.filePath;
          break;
      }
    }
  }
}
