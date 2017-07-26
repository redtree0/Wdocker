
"use strict";

var chai = require("chai");
const should = chai.should();
const expect = chai.expect;
const assert = require('chai').assert;
var config = require("../../public/js/config.js");


describe("config container 테스트",function(){
    // var config = settings();
    it('클로저로 지역변수 내부 은닉', function(){
          expect(config.container).to.be.undefined;
    });


    it('config default container GET', function(){
          config.getContainer().should.be.a("object");
    });


    it('config container SET', function(){
          var testConfig = {
              "Image" : "gggg" ,
              "name" :  "aaaa",
              "Cmd" : "bbbb"
            };
          config.setContainer(testConfig);
        config.getContainer().should.be.a("object");

        var container = config.getContainer();
        expect(container.Image).to.equal("gggg");
        expect(container.name).to.equal("aaaa");
        expect(container.Cmd).to.be.an('array');
        expect(container.Cmd).to.deep.equal(["bbbb"]);
    });
});


describe("config network 테스트",function(){

    it('클로저로 지역변수 내부 은닉', function(){
          expect(config.network).to.be.undefined;
    });

    it('config default network GET', function(){
          config.getNetwork().should.be.a("object");
    });

    it('config network SET', function(){
          var testConfig = {
              "Name" :  "aaaa",
              "driver" : "gggg" ,
              "internal" : true
            };
        config.setNetwork(testConfig);
        config.getNetwork().should.be.a("object");

        var network = config.getNetwork();
        console.log(network);
        expect(network.driver).to.equal("gggg");
        expect(network.Name).to.equal("aaaa");
        expect(network.Internal).to.be.an('boolean');
        // expect(network.Internal).to.equal("true");
        expect(network).to.include({internal: true});
    });
});


describe("config image 테스트",function(){

    it('클로저로 지역변수 내부 은닉', function(){
          expect(config.image).to.be.undefined;
    });

    it('config default image GET', function(){
          config.getImage().should.be.a("object");
    });

    it('config image SET', function(){

          var testConfig = {
              "term" :  "aaaa",
              "limit" : "gggg" ,
              "is-automated" : true,
              "is-official" : false,
              "stars" : 200
            };
        config.setImage(testConfig);
        config.getImage().should.be.a("object");
        var attr = "is-automated";
        var image = config.getImage();
        expect(image.term).to.equal("aaaa");
        expect(image.limit).to.equal("gggg");
        expect(image.stars).to.equal(200);
        expect(image["is-automated"]).to.be.an('boolean');
        expect(image["is-official"]).to.be.an('boolean');
        expect(image).to.include({  "is-automated" : true,
          "is-official" : false});

    });
});
