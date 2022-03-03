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
  return db.createTable('Users', {
    id: { type: type.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: type.STRING, length: 255, notNull: true, unique: true},
    name: { type: type.STRING, length: 255, notNull: true},
    password: { type: type.STRING, length: 255, notNull: true},
    createdAt: { type: type.TIMESTAMP, notNull: true},
    updatedAt: { type: type.TIMESTAMP, notNull: true}
  })
};

exports.down = function(db) {
  return db.dropTable('Users')
};

exports._meta = {
  "version": 1
};
