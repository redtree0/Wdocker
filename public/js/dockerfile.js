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

  ////////// function  end//////////////////////


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
