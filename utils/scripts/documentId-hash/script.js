const encryptionHelper = require('./encryption');
const zlib = require('./zlib');
const { promiseMap } = require('./promiseMap');
const { performance } = require('perf_hooks');
const bcrypt = require('bcrypt');
// ('$2b$05$Av0d8F4/PB6RfUSOZz0cQ.');
const extractAndEncryptData = async (rowId, data) => {
  const { onfido, manual } = JSON.parse(data);

  /**
   * Manual data takes priority
   */
  if (manual) {
    /**
     * Decrypt manual data
     */
    const decryptData = JSON.parse(
      await encryptionHelper.decryptString(manual),
    );

    /**
     * Must be in this order, otherwise we have different hash
     */
    const documentBaseData = {
      firstName: decryptData.firstName,
      lastName: decryptData.lastName,
      dateOfBirth: decryptData.dateOfBirth,
    };

    const documentNumber = decryptData.documentNumber;

    const encryptedDocumentNumber = await bcrypt.hash(
      documentNumber,
      process.env.HASH_SALT,
    );
    const encryptedDocumentBaseData = await bcrypt.hash(
      JSON.stringify(documentBaseData),
      process.env.HASH_SALT,
    );

    return {
      rowId,
      documentNumber: encryptedDocumentNumber,
      documentBaseData: encryptedDocumentBaseData,
    };
  } else {
    /**
     * Decrypt onfido data
     */
    const decryptData = JSON.parse(
      zlib.inflate(await encryptionHelper.decryptString(onfido)),
    );
    const { document } = decryptData;

    /**
     * Must be in this order, otherwise we have different hash
     */
    const documentBaseData = {
      firstName: document.properties.first_name,
      lastName: document.properties.last_name,
      dateOfBirth: document.properties.date_of_birth,
    };
    const documentNumber = document.properties.document_numbers
      .filter((v) => v.type === 'document_number')
      .map((v) => v.value);

    const encryptedDocumentNumber = await bcrypt.hash(
      documentNumber[0],
      process.env.HASH_SALT,
    );
    const encryptedDocumentBaseData = await bcrypt.hash(
      JSON.stringify(documentBaseData),
      process.env.HASH_SALT,
    );

    return {
      rowId,
      documentNumber: encryptedDocumentNumber,
      documentBaseData: encryptedDocumentBaseData,
    };
  }
};

const script = async (connection, idList) => {
  let limit = 100;
  let inputArray = [];

  for (let i = 0; i < idList.length; i += limit) {
    inputArray.push(idList.slice(i, i + limit));
  }

  const timeArray = [];
  await promiseMap(
    inputArray,
    async (list) => {
      const t0 = performance.now();
      /**
       * SELECT only the rows with status VERIFIED and empty hash columns
       */
      const rows = await connection.query(
        `SELECT xx, data FROM boxedout.userId WHERE xx IN (${connection.escape(
          list,
        )})`,
      );

      if (rows.length === 0) return;
      const updatePromises = [];

      for (const row of rows) {
        updatePromises.push(
          new Promise(async (resolve) => {
            if (!row.data) resolve();

            const { onfido, manual } = JSON.parse(row.data);
            if (!onfido && !manual) resolve();
            // data column could be null - skip these (only PROD)

            const result = await extractAndEncryptData(row.xx, row.data);

            await connection.query(
              'UPDATE boxedout.userId SET documentNumberHash=?, documentBaseDataHash=? WHERE xx=?',
              [result.documentNumber, result.documentBaseData, result.rowId],
            );
            resolve();
          }).catch((error) => console.log('ERROR in Row xx: ', row.xx, error)),
        );
      }

      await Promise.all(updatePromises);

      const t1 = performance.now();
      timeArray.push(Math.trunc(t1 - t0));
      console.log(
        'Time ' + Math.trunc(t1 - t0) + 'ms',
        `Handled ${rows.length} rows in chunk ${rows[0].xx} - ${
          rows[rows.length - 1].xx
        }`,
      );
      return null;
    },
    {
      concurrency: 20,
    },
  );

  const average = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  console.debug('\nMean Time: ', average(timeArray).toFixed(2), 'ms');
};

exports.script = script;
