
"use strict";

var chai = require("chai");
const should = chai.should();
const expect = chai.expect;
const assert = require('chai').assert;
// const dirTree = require('directory-tree');
// var createTree = require( 'dirtree' );

describe("dirtree 테스트", ()=>{
  it("dirtree json 생성 확인" , (done)=>{


const PATH = require('path');
const dirTree = require('directory-tree');

const tree = dirTree('/home/pirate/', {extensions:/\W/, exclude:/^\./}, (item, PATH) => {
	console.log(item);
});
    done()  ;
  });
});
