/** Database setup for BizTime. */

//ORG:
const { Client } = require("pg");

let db = new Client({
  connectionString: "postgresql://postgres:postgres_pass@localhost/biztime"
});

db.connect();


module.exports = db;

//ATTEMPT TO GET AROUND PASSWORD ERROR: 
///mnt/c/personal/Umass_Sftware_Eng/Express-Postgres/node-pg-relationships-ex1/express-biztime/node_modules/pg/lib/crypto/sasl.js:24
//    throw new Error('SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string')
//const { Client } = require("pg");
//const config = require('./config.json');  // Adjust the path as necessary
//const environment = process.env.NODE_ENV || 'development';
//const dbConfig = config[environment];
//dbConfig.password = process.env.DB_PASSWORD;
//
//const db = new Client(dbConfig);
//
//db.connect();
//
//module.exports = db;