'use strict';

var dbm;
var type;
var seed;

/*
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  const query = `
ALTER TABLE users ALTER COLUMN units SET DEFAULT '[{"type":"CITIZEN","level":1,"quantity":50}]';
`;
  return db.runSql(query);
};

exports.down = function (db) {
  const query = `
ALTER TABLE users ALTER COLUMN units SET DEFAULT '[{"unitType":"CITIZEN","quantity":50}]';
`;
  return db.runSql(query);
};

exports._meta = {
  version: 1,
};
