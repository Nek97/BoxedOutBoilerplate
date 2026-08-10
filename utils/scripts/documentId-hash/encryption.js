const localEncryption = require('./local-encryption');
const aws = require('aws-sdk');

const staticKey =
  'be088f8bb64166cc2938b1dd0c9db8fa223edd975f48462858a41f70ebee1c5f';
const encryptionMode = process.env.ENCRYPTION_MODE; //KMS
const region = process.env.KMS_REGION;
const KeyId = process.env.AWS_REMOTE_KEYID;
/**
 * Local Decryption/Encryption
 */
const encryptCallback = (resolve, reject) => {
  return (err, data) => {
    if (err) {
      return reject(err);
    }
    if (typeof data.CiphertextBlob === 'undefined') {
      return reject(
        'Error CiphertextBlob coming from kms encrypt is undefined',
      );
    }
    resolve(data.CiphertextBlob);
  };
};

const asyncEncrypt = async (toEncrypt) => {
  const kms = new aws.KMS({
    region,
  });
  const encryptionResult = await new Promise((resolve, reject) => {
    kms.encrypt(
      { Plaintext: toEncrypt, KeyId },
      encryptCallback(resolve, reject),
    );
  });

  return encryptionResult.toString('base64');
};

const decryptCallback = (resolve, reject) => {
  return (err, data) => {
    if (err) {
      return reject(err);
    }
    data.Plaintext =
      typeof data.Plaintext === 'undefined' ? '' : data.Plaintext;
    return resolve(data.Plaintext.toString());
  };
};

const asyncDecrypt = async (toDecrypt) => {
  const kms = new aws.KMS({
    region,
  });
  return new Promise((resolve, reject) => {
    kms.decrypt(
      {
        KeyId,
        CiphertextBlob: Buffer.from(toDecrypt, 'base64'),
      },
      decryptCallback(resolve, reject),
    );
  });
};

module.exports.encryptString = async (toEncrypt, encryptionKey = staticKey) => {
  switch (encryptionMode) {
    case 'KMS':
      const encryptionResult = await asyncEncrypt(toEncrypt);
      return encryptionResult;
    case 'local':
    default:
      return localEncryption.encryptAes(toEncrypt, encryptionKey);
  }
};

module.exports.decryptString = async (toDecrypt, encryptionKey = staticKey) => {
  switch (encryptionMode) {
    case 'KMS':
      const decryptionResult = await asyncDecrypt(toDecrypt);
      return decryptionResult;
    case 'local':
    default:
      return localEncryption.decryptAes(toDecrypt, encryptionKey);
  }
};
