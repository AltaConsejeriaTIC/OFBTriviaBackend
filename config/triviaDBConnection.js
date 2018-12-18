'use strict';

const Model = require('objection').Model;
const Knex = require('knex');
const knexFile = require('./triviaDBParameters');
const knexConfig = Knex(knexFile.production); //specify environment (knexFile.development or knexFile.production)
Model.knex(knexConfig);

module.exports = {
	Model: Model,
	knex: knexConfig
};