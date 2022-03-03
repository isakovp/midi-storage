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
  return db.createTable('Files', {
    id: { type: type.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: type.STRING, length: 255, notNull: true},
    description: { type: type.TEXT, notNull: true},
    abc: { type: type.TEXT, notNull: true},
    views: {type: type.INTEGER, notNull: true, defailt: 0},
    favorites: {type: type.INTEGER, notNull: true, defailt: 0},
    filename: { type: type.STRING, length: 255, notNull: true},
    createdAt: { type: type.TIMESTAMP, notNull: true},
    updatedAt: { type: type.TIMESTAMP, notNull: true},
    createdById: { type: type.INTEGER, notNull: true, foreignKey: {
        name: 'file_user_id_fk',
        table: 'Users',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'RESTRICT'
        },
        mapping: 'id'
      }
    },
  })
};

exports.down = function(db) {
  return db.dropTable('Files')
};

exports._meta = {
  "version": 1
};
