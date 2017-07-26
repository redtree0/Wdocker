
"use strict";

var chai = require("chai");
const should = chai.should();
const expect = chai.expect;
const assert = require('chai').assert;
var Docker = require("../../docker");

describe("docker 테스트", ()=>{
  describe("파라미터 0일때 socketPaht 존재", ()=>{
    it("default docker object 리턴 함" , ()=>{
        var docker = new Docker();
        docker.should.be.a("object");
        expect(docker).to.have.own.property("modem");
        expect(docker.modem).to.have.own.property("socketPath");
        expect(docker.modem.socketPath).to.equal("/var/run/docker.sock");
    })
  });
});

describe("docker 테스트", ()=>{
  describe("파라미터 1개 json(host, port) 일때", ()=>{
    it("해당 정보를 지닌 docker object 리턴 함" , ()=>{
        var opts = {host: 'http://192.168.0.120', port: 2376};
        var docker = new Docker(opts);
        docker.should.be.a("object");
        expect(docker).to.have.own.property("modem");
        expect(docker.modem).to.have.own.property("host");
        expect(docker.modem).to.have.own.property("port");

    })
  });
});

describe("docker 테스트", ()=>{
  describe("파라미터 1개 json key 정보가 불확실할 때", ()=>{
    it("custom docker object 리턴 함" , ()=>{
        var opts = {Ahost: 'http://192.168.0.120', Aports: 2376};
        var docker = new Docker(opts);
        docker.should.be.a("object");
        expect(docker.modem.host).to.be.undefined;
        expect(docker.modem.port).to.be.undefined;
    })
  });
});


describe("docker 테스트", ()=>{
  describe("파라미터 1개 type이 object가 아닐때", ()=>{
    it("false 리턴 함" , ()=>{
        var opts = 12345;
        var docker = new Docker(opts);
        docker.should.be.false;
        expect(docker).to.be.empty;
    })
  });
});
