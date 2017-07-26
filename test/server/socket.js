"use strict";

// client source test
var chai = require("chai");
const should = chai.should();
const expect = chai.expect;
const assert = require('chai').assert;

var socket = require("../../public/js/io");
var io = require('socket.io-client');

var socketURL = 'http://0.0.0.0:3000';

var options ={
  'force new connection': true
  , transports: ['websocket']
};


describe("Socket IO 테스트",function(){

    it('user login 이벤트', function(done){
            // socket 연결
            var client = io.connect(socketURL, options);

            socket(client).login(
              ()=>{
                  // socket 연결 되 있는 상태  true
                  (client.connected).should.be.true;
              }
            );

            // event 완료 후 호출 이벤트 isFinished
            client.on("isFinished", (data)=>{
              // data = true
              data.should.be.true;

              // socket 연결 되 있는 상태  true
              (client.connected).should.be.true;

              // socket 연결 끊음
              client.disconnect();
              // socket 연결이 끊긴 상태  false
              (client.connected).should.be.false;
              done();
            });


    });
});
