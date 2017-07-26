
"use strict";

var chai = require("chai");
const should = chai.should();
const expect = chai.expect;
const assert = require('chai').assert;
var table = require("../../public/js/table.js");

describe("table 테스트",function(){

  var columns = [{
        checkbox: true,
        title: 'Check'
    },{
        field: 'Id',
        title: '컨테이너 ID'
    }];


  it('클로저로 지역변수 내부 은닉', function(){
    var testTable = new table("", columns);

    // expect(testTable.checkedRowLists).to.be.an('object');
    expect(testTable.checkedRowLists).to.be.an('array').that.is.empty;;

  });

});
