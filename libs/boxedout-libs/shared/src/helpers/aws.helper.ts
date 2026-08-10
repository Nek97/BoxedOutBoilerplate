import { EncryptMode, getFileFromS3 } from '@nestjs-yalc/aws-helpers';
import { ValueTransformer } from 'typeorm';
import { AwsServiceType } from '../enum';

/**
 * Get the boolean value of a specific combination of AWS Service
 * @description The function use BitMask technique
 * @param awsBitMask bit mask of AWS service requested
 * @returns boolean
 */
export function isAwsServiceEnabled(awsBitMask: number): boolean {
  // AWS_FLAG contains AwsServiceType values
  const awsFlagEnv = process.env.AWS_FLAG;

  if (!awsFlagEnv) {
    return false;
  } else {
    return parseInt(awsFlagEnv) & awsBitMask ? true : false;
  }
}

/**
 *
 * @deprecated
 */
export const transformS3Field = (): ValueTransformer => {
  const transformer = async (value: string) => {
    const isAwsEnv = isAwsServiceEnabled(AwsServiceType.S3);
    const bucket = process.env.S3_BUCKET ?? '';
    return isAwsEnv ? await getFileFromS3(value, bucket) : value;
  };

  return {
    to: (value) => value, // no transformation for writing
    from: transformer,
  };
};

export function getEncMode(): EncryptMode {
  return isAwsServiceEnabled(AwsServiceType.SDK)
    ? EncryptMode.AWS
    : EncryptMode.LOCAL;
}
