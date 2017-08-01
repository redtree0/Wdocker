"use strict";

$(function(){
  var socket = io();
  var preindex = 0;
  var filePath = null;
  var $path = $("#path");
  var $fileName = $("#filename");
  var $editor = $("#editor");
  var socket = io();
  var Socket = require("./io");
  var client = new Socket(socket, $('body'));
  var spin = require("./spinner");
  var $jstree = $("#jstree");

  var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    lineNumbers: true,
    mode: "dockerfile"
  });


function reportMenu ($node) {
          function changePath(path, renew, isReNew){
            var originPath = path;
            var splitPath = originPath.split("/");
            if(isReNew){
              splitPath.pop();
            }
            splitPath.push(renew);
            return  splitPath.join("/");
          }

           var tree = $("#jstree").jstree(true);
           return {
               "CreateDirectroy": {
                   "separator_before": false,
                   "separator_after": false,
                   "label": "새 폴더",
                   "action": function (obj) {
                       $node = tree.create_node($node);
                       console.log($node);

                       tree.edit($node, "",  ($node)=>{
                         var newDirectory = tree.get_text($node);
                         var parentId = (tree.get_parent($node));
                         var parentPath = tree.get_node(parentId).original.path;
                         var newPath = changePath(parentPath, newDirectory, false);
                         console.log(newPath);
                         var opts = {
                           path : parentPath,
                           name : newDirectory
                         }
                         client.sendEvent("CreateDirectory", opts);
                         socket.emit("dirtree", "", (data)=>{
                            jstreeRefresh($jstree, data);
                         });
                       });

                   }
               },
               "CreateFile": {
                   "separator_before": false,
                   "separator_after": false,
                   "label": "새 파일",
                   "action": function (obj) {
                       $node = tree.create_node($node);
                       console.log($node);

                       tree.edit($node, "",  ($node)=>{
                        //  "glyphicon glyphicon-file"
                         tree.set_icon($node, "glyphicon glyphicon-file");
                         var newFile = tree.get_text($node);
                         var parentId = (tree.get_parent($node));
                         var parentPath = tree.get_node(parentId).original.path;

                         var opts = {
                           path : parentPath,
                           name : newFile
                         }
                         client.sendEvent("CreateFile", opts);
                           socket.emit("dirtree", "", (data)=>{
                              jstreeRefresh($jstree, data);
                           });
                        //  console.log(parentPath);
                       });
                   }
               },
               "Rename": {
                   "separator_before": false,
                   "separator_after": false,
                   "label": "이름 수정",
                   "action": function (obj) {
                       tree.edit($node, "", ($node)=>{
                         console.log(tree.get_text($node));
                         console.log($node.original.path);
                         var rename = tree.get_text($node);
                         var originPath = $node.original.path;
                        //  var splitPath = originPath.split("/");
                        //  splitPath.pop();
                        //  splitPath.push(rename);
                        //  var renewPath = splitPath.join("/");
                        var renewPath = changePath(originPath, rename, true);
                         var opts ={
                           origin : originPath,
                           renew : renewPath
                         }
                          client.sendEvent("RenameFile", opts);
                       });
                   }
               },
               "Remove": {
                   "separator_before": false,
                   "separator_after": false,
                   "label": "삭제",
                   "action": function (obj) {
                       var type = ($node.original.type);
                       var deletePath = ($node.original.path);
                       tree.delete_node($node);
                       var opts = {
                         type : type,
                         path : deletePath
                       };
                       client.socketEvent("RemoveFile", opts, completeEvent);

                       console.log($node);
                       console.log(obj);
                   }
               }
           };
       }


  var lists = [];
  lists = initJstree(lists);
  function initJstree(lists){
    socket.emit("dirtree", "", (data)=>{
              lists = data;
              console.log(JSON.stringify(lists));
              $('#jstree').jstree({
                  'plugins': ["wholerow", "contextmenu"],
                   'core' : {
                      'data' : lists,
                      "check_callback" : true,
                      'themes': {
                          'name': 'proton',
                          'responsive': true
                        }
                  }, "contextmenu":{
                       "items": reportMenu
                     }
                });
                return lists;
    });
  }


function jstreeRefresh($jstree, newTree){
  $jstree.jstree(true).settings.core.data = newTree;
  $jstree.jstree(true).refresh();
}


      function findNodeIndex(text){
        for(var i in lists){
          if(text === lists[i].text){
            return i;
          }
        }
      }
      $('#jstree').on("click", ".jstree-anchor", function(e) {

            var node = $('#jstree').jstree(true).get_node($(this)).original;
            var path = node.path;
            console.log(node.path);
            $path.text(node.path);
            $fileName.text(node.text);

      });

      $('#jstree').on("dblclick", ".jstree-anchor", function(e) {
        var text = $('#jstree').jstree(true).get_node($(this)).text;
        var node = $('#jstree').jstree(true).get_node($(this)).original;
        var path = node.path;
        var type = node.type;
        if(type === "file"){
          socket.emit("ReadFile", path, (data)=>{
              editor.setValue(data);
          });
        }else if (type === "directory") {
          socket.emit("dirtree", path , (data)=>{
              var lists = data;
               $('#jstree').jstree(true).settings.core.data = lists;
               $('#jstree').jstree(true).refresh();
            });
        }
      });



      function completeEvent(data, callback){
        if(data){
          console.log(data);
          $fileName.val("");
          $editor.text("");
        }
        callback;
      }



      $(".update").click(function(e) {
          e.preventDefault();
          console.log("update click");

          // fileNode.setName($fileName.val());
          // fileNode.setContext(editor.getValue());
          var opts ={
            path : $path.text(),
            context : editor.getValue()
          }
          client.socketEvent("UpdateFile", opts, completeEvent);
      });


      $("#build").click(()=>{
        function changePath(path, renew, isReNew){
          var originPath = path;
          var splitPath = originPath.split("/");
          if(isReNew){
            splitPath.pop();
          }
          splitPath.push(renew);
          return  splitPath.join("/");
        }

          var opts ={
            parentPath : changePath($path.text(), "", true),
            path : $path.text(),
            name : $fileName.text(),
            context : editor.getValue()
          };
          console.log(opts);
          socket.emit("build", opts, (data)=>{
            if(data){
              console.log("done");
            }
          });
      });


});
