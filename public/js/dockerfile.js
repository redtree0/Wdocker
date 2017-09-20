"use strict";

$(function(){
    const COMPLETE = {
      DO : true,
      NOT : false
    }

    var $path = $("#path");
    var dialog = require("./module/dialog");

    var $jstree = $("#jstree");
    var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
      lineNumbers: true,
      mode: "dockerfile"
    });
    editor.setSize(950, 440);
    var $all = {};
    // $all.connect = {};
    // $all.connect.dockerinfo = "image";
    $all.lists = [];
    $all.init = function(client){
      var client = client;
      var $jstree = $("#jstree");

      // console.log(this);
      this.lists = initJstree();

      function dirtreeRefresh(path){
        // console.log("refresh");
        var defaultPath = "";
        if(path === null || path === undefined){
          defaultPath = "";
        }else{
          defaultPath = path;
        }
        // console.log(defaultPath);
        client.sendEvent(COMPLETE.NOT, "dirtree", defaultPath, (data)=>{
          jstreeRefresh($jstree, data);
        });

        function jstreeRefresh($jstree, newTree){
          $jstree.jstree(true).settings.core.data = newTree;
          $jstree.jstree(true).refresh();
        }
      }


      $jstree.on("click", ".jstree-anchor", function(e) {

            var node =   $jstree.jstree(true).get_node($(this)).original;
            var path = node.path;
            // console.log(node.path);
            // $path.text(node.path);

            $path.html(node.path);
            var type = node.type;
            if(type === "file"){
              client.sendEvent(COMPLETE.NOT, "ReadFile", path, (data)=>{
                  editor.setValue(data);
              });
            }

      });

        $jstree.on("dblclick", ".jstree-anchor", function(e) {
        // var text = $('#jstree').jstree(true).get_node($(this)).text;
        var node =   $jstree.jstree(true).get_node($(this)).original;
        var path = node.path;
        var type = node.type;
        if (type === "directory") {
          // console.log(path);
            dirtreeRefresh(path);
        }
      });



      function initJstree(){
        // var client = main.getSocket();
        var lists = [];
        client.sendEvent(COMPLETE.NOT, "dirtree", "", (data)=>{
                  lists = data;
                  // console.log(JSON.stringify(lists));
                $jstree.jstree({
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


        function changePath(path, renew, isReNew){
            var originPath = path;
            var splitPath = originPath.split("/");
            if(isReNew){
              splitPath.pop();
            }
            splitPath.push(renew);
            return  splitPath.join("/");
          }


        function reportMenu ($node) {
          // console.log("reportMenu");
                  //  var client = main.getSocket();
                   var tree = $("#jstree").jstree(true);
                   return {
                       "CreateDirectroy": {
                           "separator_before": false,
                           "separator_after": false,
                           "label": "새 폴더",
                           "action": function (obj) {
                               $node = tree.create_node($node);
                              //  console.log($node);

                               tree.edit($node, "",  ($node)=>{
                                 var newDirectory = tree.get_text($node);
                                 var parentId = (tree.get_parent($node));
                                 var parentPath = tree.get_node(parentId).original.path;
                                 var newPath = changePath(parentPath, newDirectory, false);
                                //  console.log(newPath);
                                 var opts = {
                                   path : parentPath,
                                   name : newDirectory
                                 }
                                 client.sendEvent(COMPLETE.NOT, "CreateDirectory", opts);
                                 dirtreeRefresh();
                               });

                           }
                       },
                       "CreateFile": {
                           "separator_before": false,
                           "separator_after": false,
                           "label": "새 파일",
                           "action": function (obj) {
                               $node = tree.create_node($node);
                              //  console.log($node);

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
                                 client.sendEvent(COMPLETE.NOT, "CreateFile", opts);
                                 dirtreeRefresh();

                               });
                           }
                       },
                       "Rename": {
                           "separator_before": false,
                           "separator_after": false,
                           "label": "이름 수정",
                           "action": function (obj) {
                               tree.edit($node, "", ($node)=>{

                                 var rename = tree.get_text($node);
                                 var originPath = $node.original.path;

                                var renewPath = changePath(originPath, rename, true);
                                 var opts ={
                                   origin : originPath,
                                   renew : renewPath
                                 }
                                  client.sendEvent(COMPLETE.NOT, "RenameFile", opts);
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
                               client.sendEvent(COMPLETE.NOT, "RemoveFile", opts);
                               //
                              //  console.log($node);
                              //  console.log(obj);
                           }
                       }
                   };
               }


      }
    }
    $all.completeEvent = function completeEvent(data, callback){
      if(data){
        var $editor = $("#editor");
        // console.log(data);
        $editor.text("");
      }
      // callback;
    }
    var main = require("./module/main.js");
    main.init($all);
    var client = main.getSocket();



    var $building = $("#building");
    var popup = new dialog("이미지 생성", $building);

    client.listen("buildingImage", (data)=>{
          if(data.hasOwnProperty("stream")){
            $building.append(data.stream + "<br />");
          }
          if(data === true){
            popup.close(5000);
          }

    });
    function fileSave(callback){
          var context = editor.getValue();
          var path = $path.text().trim();
          if(path === ""){
            return ;
          }
          if(context === ""){
            return ;
          }
          var opts ={
            "path" : path,
            "context" : context
          }

          client.sendEvent(COMPLETE.NOT, "UpdateFile", opts);
          callback();
    }

    $("#save").click(function(e) {
        e.preventDefault();
         fileSave();
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
            // var client = main.getSocket();

          fileSave(()=>{
              var $imageTag = $("#imageTag");
              if(!$imageTag.val()){
                return ;
              }

              var opts ={
                path : $path.text().trim(),
                imageTag : $imageTag.val()
              };

              client.sendEvent(COMPLETE.NOT, "build", opts);
              popup.show();
          });


    });

});
