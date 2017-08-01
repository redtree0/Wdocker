
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

function arraysEqual(a,b) {
  /*
      Array-aware equality checker:
      Returns whether arguments a and b are == to each other;
      however if they are equal-lengthed arrays, returns whether their
      elements are pairwise == to each other recursively under this
      definition.
  */
  if (a instanceof Array && b instanceof Array) {
      if (a.length!=b.length)  // assert same length
          return false;
      for(var i=0; i<a.length; i++)  // assert each element equal
          if (!arraysEqual(a[i],b[i]))
              return false;
      return true;
  } else {
      return a==b;  // if not both arrays, should be the same
  }
}

function jstreeList(json, parentid, leafs){
    if (json === null) {
      // console.log("done");
      return null;
    }
    if( arguments.length === 1 ){
      var lists = [];
    }else {
      var lists = leafs;
    }
    var ID = function () {
      return '_' + Math.random().toString(36).substr(2, 9);
    };
    // console.log(JSON.stringify(json));
        var tree = function (id, text, parent, path) {

        function getDepth(path) {
          var splitPath = path.split("/");

          return splitPath.filter((val)=>{if(val) {return val;}}).length;
        }

          var id = null;
          var text = null;
          var parent = null;
          var path = null;
          var depth = null;
          var getLeaf = function() {
              return { id : id, text : text, parent : parent, path : path, depth : depth};
          }
          var setLeaf = function(_id, _text, _parent, _path) {
                 id = _id;
                 text = _text;
                 parent = _parent;
                 path = _path;
                 depth = getDepth(_path);
                 return getLeaf();
          }
          var getId = function () {
            return id;
          }
          return { getLeaf : getLeaf, setLeaf : setLeaf ,getId : getId };
      }();

  if(parentid === null) {
      var splitPath = json.path.split("/").filter((val)=>{if(val) {return val;}});
      splitPath.pop();
      var parentPath = splitPath.join("/");
      var parentDir = tree.setLeaf(ID(".."), "..","#", parentPath);
      // console.log(data.getId());
      // console.log(parentDir);
      var id = ID(json.name);
      var workingDir = tree.setLeaf(id, json.name,"#", json.path);

      lists.push(parentDir);
      lists.push(workingDir);
      var parentid = tree.getId();
  }

  var child = json.children;
  if(typeof child === undefined) {
    // console.log("no have child");
    return null;
  }

  for(var i in child) {
    var leaf = tree.setLeaf(ID(child[i].name), child[i].name, parentid, child[i].path);
    // var leafNode = data.getLeaf();
    if(child[i].hasOwnProperty("extension")){
      leaf.icon = "glyphicon glyphicon-file"
    }
    lists.push(leaf);
    console.log(tree.getId());
    jstreeList(child[i], tree.getId(), lists);

  }
  return lists;
}

describe("dirtree 테스트", ()=>{
  it("dirtree to jstree 변환" , (done)=>{
  // var home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
  var home = '/home/pirate/dockerfile/';

  var tree = dirTree(home, {extensions:/\W/, exclude:/^\./});
  var data = jstreeList(tree);
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

  var tree = dirTree(home, {extensions:/\W/, exclude:/^\./});
  var lists = jstreeList(tree);
  console.log(lists);
  console.log(typeof lists);
  // console.log(lists);
  var searchDepth = 5;
  var condition =  [ 'home', 'pirate', 'dockerfile', '1' ];
  function getSplitPath(path) {
    var splitPath = path.split("/");

    return splitPath.filter((val)=>{if(val) {return val;}});
  }
  var jstree = [];
  for (var i in lists) {
    if(searchDepth === lists[i].depth){
          var tmp = lists[i].path;
          var spacefilter = getSplitPath(tmp);
          spacefilter.pop();
          if(arraysEqual(spacefilter,  condition)){
            // console.log(lists[i]);
            jstree.push(lists[i]);
            // console.log(i);
            var n = parseInt(i)+1;
            var start = i;
            break;
            // console.log(n);
            // console.log(lists[n]);
          }
    }
  }
  var len = lists.length;
  var parentDepth = lists[start].depth -1;
  console.log(parentDepth);
  for (var i = start; i<len; i++){
    console.log(lists[i].depth);
    // if((parentDepth == (lists[i].depth)) || (depth > (lists[i].depth))) {
    if(parentDepth >= (lists[i].depth)) {
      var end = i;
      break;
    }
  }
  var newTree = [];
  for(var i = start; i < end; i++ ){
    newTree.push(lists[i]);
  }
  console.log(newTree);

  done();

  });
});
