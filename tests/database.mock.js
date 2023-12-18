const Sequelize = require("sequelize");
require("pg");

const CREDENTIALS = {
  host: "127.0.0.1",
  port: 5432,
  dbname: "pg_dump_restore_tests",
  username: "postgres",
  password: "5660c0d8-8cbc-4934-b841-3334e72b120f",
};

let databaseConfig = {
  logging: () => {},
  dialect: "postgres",
  host: CREDENTIALS.host,
  database: CREDENTIALS.dbname,
  username: CREDENTIALS.username,
  port: CREDENTIALS.port,
  password: CREDENTIALS.password,
};

let sequelize = new Sequelize(databaseConfig);

const Patient = sequelize.define(
  "patient",
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
    },
    data: { type: Sequelize.JSON },
    misc: { type: Sequelize.JSON },
  },
  {
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    paranoid: true,
  }
);

const populate = async () => {
  let patient2 = await Patient.create(
    {
      id: "p4567",
      data: { wow: 1 },
      misc: {},
    },
    { user_id: "ME" }
  );
};

module.exports = { Patient, sequelize, populate, CREDENTIALS };
