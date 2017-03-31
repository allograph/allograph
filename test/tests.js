var assert = require('assert');
const express = require("express");
const graphHTTP = require("express-graphql");
const app = express();
process.env.NODE_ENV = 'test';
const dbTranslator = require('../index.js').DBTranslator;

var chai = require('chai');
var should = chai.should();
var chaiHttp = require('chai-http');
chai.use(chaiHttp)

const schema = require("../generated/schema.js").Schema;

app.use('/graphql', graphHTTP({
  schema: schema,
  pretty: true,
  graphiql: true,
}));

var knex = require(__dirname + '/../database/connection')

describe("Table creation", function(){   
  beforeEach(function(done) {
    knex.migrate.rollback()
    .then(function() {
      knex.migrate.latest()
      .then(function() {
        return knex.seed.run()
        .then(function() { 
          dbTranslator.generate()
          done();          
        });
      });
    });
  });

  afterEach(function(done) {
    knex.migrate.rollback()
    .then(function() {
      done();
    });
  }); 

  after(function(done) {
    // process.env.NODE_ENV = 'development';
    // dbTranslator.generate()
    done()
  })

  describe('A user table is created.', function() {
    let expected = {
      "data": {
        "users": [
          {
            "email": "pfitzgerald@usa.com"
          }        
        ]
      }
    }

    it('should create and retrieve a user', function(done) {
      chai.request(app)
      .get("/graphql?query={users(id: 2){email}}")     
      .end(function(err, res) {   
        res.should.have.status(200);
        assert.deepEqual(JSON.parse(res.text), expected)
        done();
      });
    });
  });
});