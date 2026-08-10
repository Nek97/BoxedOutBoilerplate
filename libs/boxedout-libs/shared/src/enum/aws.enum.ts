/* istanbul ignore file */
export enum AwsSsmVariable {
  DB_BOXEDOUT_MASTER_PASSWORD = 'DB_BOXEDOUT_MASTER_PASSWORD',
  DB_CORE_API_PASSWORD = 'DB_CORE_API_PASSWORD',
  DB_CORE_API_CLI_PASSWORD = 'DB_CORE_API_CLI_PASSWORD',
  JWT_SECRET_PVT = 'JWT_SECRET_PVT',
  JWT_SECRET_PUB = 'JWT_SECRET_PUB',
}

/**
 * Enum that maps the service type to the environment variable configured
 */
export enum AwsServiceType {
  /**
   * Bootstrap
   */
  ENV = 1,
  SDK = 2,
  SSM = 4,
  S3 = 8,
  SQS = 16,
  ALL_FLAGS = ENV | SDK | SSM | S3,
}
