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
  return db.addColumn('Files', "status", {
    type: type.TEXT, notNull: true, defaultValue: 'new'
  })
};

exports.down = function(db) {
  return db.removeColumn('Files', "status")
};

exports._meta = {
  "version": 1
};
