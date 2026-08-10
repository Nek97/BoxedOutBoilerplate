const mysql = require('promise-mysql');
const { script } = require('./script');
require('dotenv').config();

const host = process.env.MYSQL_HOST;
const user = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASSWORD;
const port = process.env.MYSQL_PORT;
const database = 'boxedout';

exports.handler = async () => {
  console.log('START HANDLER');
  const pool = await mysql.createPool({
    connectionLimit: 10,
    port,
    host,
    user,
    password,
    database,
    acquireTimeout: 1000000,
  });

  const idList = await pool.query(
    "SELECT xx FROM boxedout.userId WHERE status='verified' AND (documentNumberHash IS NULL OR documentBaseDataHash IS NULL) ORDER BY xx ASC",
  );

  console.log('Max element count: ', idList.length);
  await script(
    pool,
    idList.map((v) => v.xx.toString()),
  );
  await pool.end();
};

exports.handler();
