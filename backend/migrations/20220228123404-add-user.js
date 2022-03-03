'use strict';

let dbm;
let type;
let seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  const date = new Date(Date.now() - new Date().getTimezoneOffset() * 60 * 1000).toISOString()
  return db.insert('Users', ['email', 'name', 'password', 'createdAt', 'updatedAt'], ['isakovp@gmail.com', 'Pavel Isakov', '$2a$10$8UL5Ah.l5YMk4Bi3budILeQmtjJlwI1ohgaYrySdrzDmvrvfh9iLG', date, date])
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
