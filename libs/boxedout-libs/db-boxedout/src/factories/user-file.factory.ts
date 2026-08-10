// @ts-nocheck
/* istanbul ignore file */

import { isAwsServiceEnabled } from '@boxedout-libs/shared/helpers/aws.helper';
import { AwsServiceType } from '@boxedout-libs/shared/enum/aws.enum';
import { define } from 'typeorm-seeding';
import { UserFile } from '../entities';
import Faker from 'faker';

const filePath =
  'https://en.wikipedia.org/wiki/Barack_Obama#/media/File:President_Barack_Obama.jpg';

const filePathAWS =
  '00775cd6-e357-4d69-bd90-ae18636482b1/00775cd6-e357-4d69-bd90-ae18636482b1_front_identification.png';

const filePathPoF =
  '82dddb73-0cb8-4ded-8082-929e9c23c1d6/244a6e0c-986a-4770-ba4d-e4ee5538ff98.png';

const map: { [id: string]: string } = {
  userIdentification: filePathAWS,
  proofOfFunds: filePathPoF,
};
export const userFileFactory = (faker: typeof Faker) => {
  const data = new UserFile();
  data.category = faker.random.arrayElement(Object.keys(map));
  data.filePath = isAwsServiceEnabled(AwsServiceType.S3)
    ? map[data.category]
    : filePath;
  return data;
};

define(UserFile, userFileFactory);
