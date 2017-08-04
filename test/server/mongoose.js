
"use strict";

var chai = require("chai");
const should = chai.should();
const expect = chai.expect;
const assert = require('chai').assert;
// ......
var mongoose  = require('mongoose');

// [ CONFIGURE mongoose ]
describe("mongoose 테스트", ()=>{
  describe("DB Conntection", ()=>{
        it(" 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting " , ()=>{
            var db = mongoose.connection;
            db.on('error',
              console.error
            );

            db.once('open', function(){
              console.log("Connected to mongod server");
            });
            mongoose.connect('mongodb://localhost/nocker', function(err) {
                if (err) {
                  throw err
                }
            });
            // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
            var state = mongoose.connection.readyState;
            // should.equal(state, 0, "DB disconnected");
            // should.equal(state, 1, "DB connected");
            // should.equal(state, 2, "DB connecting");
            // should.equal(state, 3, "DB disconnecting");

        });
  });
});

var mongoose = require('mongoose');

describe("mongoose 테스트", ()=>{
  describe("DB Conntection", ()=>{
        it(" 스키마 생성 " , ()=>{

          var Schema = mongoose.Schema;
          var docker = new Schema({
            ip : String,
            port : String,
            user : String,
            password : String
          });

          mongoose.model('docker', docker);

        });
  });
});
