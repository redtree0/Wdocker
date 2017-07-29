
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

function jstreeList(json, parentid, lists){
  if (json === null) return null;

  var ID = function () {
    return '_' + Math.random().toString(36).substr(2, 9);
  };
  function getDepth(path) {
    var splitPath = path.split("/");

    return splitPath.filter((val)=>{if(val) {return val;}}).length;
  }

  // console.log(JSON.stringify(json));
  var data = function (id, text, parent, path) {
      this.id = id;
      this.text = text;
      this.parent = parent;
      this.path = path;
      this.depth = getDepth(path);
  };
  data.prototype.getJSON = function() {
      var self = this;
      return { id : self.id, text : self.text, parent : self.parent, path : self.path, depth : self.depth};
  }

  if(parentid == null) {
      var splitPath = json.path.split("/").filter((val)=>{if(val) {return val;}});
      splitPath.pop();
      var parentPath = splitPath.join("/");
      var parentDir = new data(ID(".."), "..","#", parentPath);
      var id = ID(json.name);
      var workingDir = new data(id, json.name,"#", json.path);

      lists.push(parentDir.getJSON());
      lists.push(workingDir.getJSON());
  }

  var child = json.children;
  if(typeof child == undefined) {
    return null;
  }

  for(var i in child) {
    var leaf = new data(ID(child[i].name), child[i].name, parentid, child[i].path);
    var leafNode = leaf.getJSON();
    if(child[i].hasOwnProperty("extension")){
      leafNode.icon = "glyphicon glyphicon-file"
    }
    lists.push(leafNode);
    jstreeList(child[i], leaf.id, lists);

  }
}

describe("dirtree 테스트", ()=>{
  it("dirtree to jstree 변환" , (done)=>{
  // var home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
  var home = '/home/pirate/dockerfile/';

  var lists = [];
  var tree = dirTree(home, {extensions:/\W/, exclude:/^\./});
  jstreeList(tree, null, lists);

  // console.log(lists);
  done();
  // 	console.log(item);
  // });
  });
});

describe("dirtree 테스트", ()=>{
  it("jstree 같은 부모 path 찾기" , (done)=>{
  // var home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
  var home = '/home/pirate/dockerfile/';

  var lists = [];
  var tree = dirTree(home, {extensions:/\W/, exclude:/^\./});
  jstreeList(tree, null, lists);

  // console.log(lists);
  var searchDepth = 5;
  function getSplitPath(path) {
    var splitPath = path.split("/");

    return splitPath.filter((val)=>{if(val) {return val;}});
  }
  var storage = [];
  for (var i in lists) {
    if(searchDepth === lists[i].depth){
          // console.log(lists[i]);
          var tmp = lists[i].path;
          var filter = getSplitPath(tmp);
          filter.pop();
          storage.push(filter);
          // console.log(filter);
    }
  }
  var condition =  [ 'home', 'pirate', 'dockerfile', '1' ];
  console.log(storage);
  for (var i in storage) {
    ;
    console.log(storage[i]);
    console.log(condition);
    console.log(condition.sort().toString() == storage[i].sort().toString());

  }
  done();
  // 	console.log(item);
  // });
  });
});
