"use strict";
/* jshint esnext:true, -W110 */

var Sequelize, sequelize, DataTypes, Promise = require('bluebird'), _ = require('lodash'), moment = require('moment');

Sequelize = DataTypes = require('./index.js');
// var db = sequelize = new Sequelize('sequelize', 'root', '', {
var db = sequelize = new Sequelize('sequelize_test', 'postgres', 'postgres', {
  dialect: 'postgres',
//var db = sequelize = new Sequelize('sequelize-test-72', 'sequelize', 'nEGkLma26gXVHFUAHJxcmsrK', {
//   dialect: 'sqlite',
  //dialect: 'mssql',
  //host: 'mssql.sequelizejs.com',
  //port: 11433,
  // dialect: 'sqlite',
  //storage: '/tmp/test.sqlite',
//  timezone: '+05:30',
  define: {
    // timestamps: false,
  },
  logging: console.log
});

const Company = sequelize.define('company', {
  name: Sequelize.STRING
});

return sequelize.sync({
  force: true,
  logging: console.log
})
  .then(() => {
    let name = 'jan'
    return Company.findAll({where: {name: {$iLike: "%"+name+"%"}}})
  })
  .finally(() => sequelize.close());
