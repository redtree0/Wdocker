"use strict";

$(function(){
  var socket = io();
  var preindex = 0;

////////// function //////////////////////
  function showFileList(){
    // console.log("do");
    function addFileList( _class,  _text){
      return $('<button/>', { class: _class, text: _text , id: _text});
    }

    var file =[];

    $.getJSON("/myapp/dockerfile/data.json", function(json, textStatus) {
      $("#filelist button").remove();
      json.forEach((data)=>{
        // console.log(data);
        file = data;
         $("#filelist").append(addFileList("btn btn-success file", data.name));
      });
    });
  }
  var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    lineNumbers: true,
    mode: "dockerfile"
  });

  console.log("do");

  ///////////////////
  function jstreeList(json, parentid, lists){
    if (json === null) return null;

    var ID = function () {
      return '_' + Math.random().toString(36).substr(2, 9);
    };
    console.log(JSON.stringify(json));
    var data = function (id, text, parent, path) {
        this.id = id;
        this.text = text;
        this.parent = parent;
        this.path = path;
    };
    data.prototype.getJSON = function() {
        var self = this;
        return { id : self.id, text : self.text, parent : self.parent, path : self.path};
    }

    if(parentid == null) {
        var parentid = ID(json.name);
        var root = new data(parentid, json.name,"#", json.path);
        console.log(json.path);
        var splitPath = json.path.split("/");
        splitPath.pop();
          /* Initialise a final array to save the paths. Store the first one in there! */
          var parentPath = splitPath.join("/");
          console.log(parentPath);
          /* Check if there are multiple paths available */

        var grandParent = new data(ID(".."), "..","#", parentPath);
        lists.push(grandParent.getJSON());
        lists.push(root.getJSON());
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
  var lists = [];
      socket.emit("dirtree", "", (data)=>{

          jstreeList(data, null, lists);
          // $("#filelist").jstree("set_theme", "apple");
                $('#jstree').jstree({
                  // 'plugins': ["wholerow", "checkbox"],
                    'plugins': ["wholerow"],
                     'core' : {
                        'data' : lists,
                        'themes': {
                            'name': 'proton',
                            'responsive': true
                          }
                    }
                  });
      });

      $('#jstree').on("dblclick", ".jstree-anchor", function(e) {
        var text = $('#jstree').jstree(true).get_node($(this)).text;
         var path = null;
         console.log(path);
         var index =null;
         for(var i in lists){
           if(text == lists[i].text){
            //  console.log(text);
             path = (lists[i].path);
             index = i;
             console.log(path);
           }
          }
          if(path){
            // console.log(lists);
            // console.log(lists[index]);
            // console.log(path);
            // var length =lists.length;
            // var newRootId = lists[index].id ;
            // console.log(newRootId);
            // for(var i = index; i< length ; i++){
            //    if(newRootId == lists[i].parent){
            //      console.log(lists[i]);
            //    } else if (newRootId != lists[i].parent){
            //      console.log(lists[i]);
            //      break;
            //    }
            //  }
            // socket.emit("dirtree", path , (data)=>{
            //   lists = [];
            //   jstreeList(data, null, lists);
            //   $('#jstree').jstree(true).settings.core.data = lists;
            //   $('#jstree').jstree(true).refresh();
            // });
          }
      });


      // $('#jstree').bind("dblclick.jstree", function (event) {
      //    var node = $(event.target).closest("li");
      //    var data = node.data(this);
      //    console.log(node.text());
      //    console.log(node);
      //    console.log(data.text());
      //    console.log(data);
      //
      //    var selected = [];
      //     $('#jstree').jstree('get_selected').each(function () {
      //         selected.push(this.text);
      //     });
      //     // do summit with them
      //     console.log(selected);
        //  console.log(JSON.stringify(lists));
        //  console.log(lists.includes(data));
        //  for(var i in lists){
         //
        //    console.log(lists[i].text);
        //  }
        //  socket.emit("dirtree", "..", (data)=>{
        //      var lists = [];
        //      jstreeList(data, null, lists);
        //      $('#jstree').jstree(true).settings.core.data = lists;
        //      $('#jstree').jstree(true).refresh();
        //  });
         // Do some action
      // });


    showFileList();

      $("#CreateFile").submit(function(e) {
          e.preventDefault();
					var file ={};
					file.name = $("#filename").val();
					file.context = $("#editor").val();
          console.log($("#editor").val());
          console.log($("#editor").html());
          console.log($("#editor").text());
					if(file.name == null){
						return ;
					}
					// console.log("createfile");
					// console.log(file.context);
          socket.emit("CreateFile", file);
          socket.on("doneCatch", (istrue)=>{
            if(istrue)
              { showFileList();}
          })

      });

      $("#removeFile").click(()=>{
          socket.emit("RemoveFile",$("#filename").val());
          $("#filename").val("");
          $("#editor").text("");
          socket.on("doneCatch", (istrue)=>{
            if(istrue)
              { showFileList();}
          })
      });

      $("#build").click(()=>{


          var file ={};

          file.name = $("#filename").val();
          file.context = $("#editor").text();
          socket.emit("build", file);
          console.log("done");
      });
			  $("#filelist").on("click", "button", (e)=> {
					var filename = e.target.id;
					$("#filename").val(filename);
					socket.emit("fileRead", filename);
				});

				socket.on("fileLoad", (data)=>{
          // var tmp = data.replace(/\n/g,"<br class='line'/>");
          // console.log(tmp);
          console.log(data);
          // $("#editor").append(data);
          editor.setValue(data);

				});
});
