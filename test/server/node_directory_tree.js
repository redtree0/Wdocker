
"use strict";

var chai = require("chai");
const should = chai.should();
const expect = chai.expect;
const assert = require('chai').assert;
const PATH = require('path');
const dirTree = require('directory-tree');

// const dirTree = require('directory-tree');
// var createTree = require( 'dirtree' );

describe("dirtree 테스트", ()=>{
  it("dirtree json 생성 확인" , (done)=>{
  //
  // const tree = dirTree('/home/pirate/', {extensions:/\W/, exclude:/^\./});
    done();
  });
});


describe("dirtree 테스트", ()=>{
  it("dirtree json 생성 확인" , ()=>{
  console.log(__dirname);
  var home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
  console.log(home);
  var tree = dirTree(home, {extensions:/\W/, exclude:/^\./});
  console.log(tree);
  // 	console.log(item);
  // });
    // done();
  });
});
