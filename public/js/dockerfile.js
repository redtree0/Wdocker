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


  function textnewLine(_class){
    console.log("do");
    $("." + _class).html("&NewLine;");
    $("#editor").find("br").html("&nbsp;&SmallCircle;&nbsp;");
  }
  function textConvert(id){
    var $editor = $("#"+ id);

    var text = $editor.text().replace(/[\s]+/g, " ").trim();
    var word = text.split(" ");

    return word;
  }

  function textAddColor(id, index){
    var $editor = $("#"+ id);
    var newHTML = "";
    var word = textConvert(id);
    // console.log(word);
    $.each(word, function(index, value){
          // console.log("value : %s",value);

        switch(value.toUpperCase()){
            case "FROM":
            case "RUN":
            case "ENV":
            case "EXPOSE":
            case "CMD":
                newHTML += "<span class='statement'>" + value + "&nbsp;</span>";
                break;
            case "∘":
                 newHTML += "<br class='line'/>"
                break;

            default:
                newHTML += "<span class='other'>" + value + "&nbsp;</span>";
        }
    });
    // console.log(newHTML);

    $editor.html(newHTML);
    textnewLine("line");

    // console.log(index);
    var child = $editor.children();
    if(index == -1){
      var index = 0;
    }
    var range = document.createRange();
    var sel = window.getSelection();
    console.log(index);
    range.setStart(child[index], 1);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    $editor[0].focus();
  }
  ////////// function  end//////////////////////


    showFileList();
  $("#editor").on("keydown", function(e){
    var enterKey = 13;
    var spaceKey = 32;
    var tapKey = 9;


    if(e.keyCode == tapKey) {
      var $tab = $("<span/>", {class: "tab"});
      window.getSelection().getRangeAt(0).insertNode($tab[0]);
      $tab.html("&nbsp;&shy;&nbsp;&shy;&nbsp;&shy;&nbsp;&shy;");
      e.preventDefault();
    } else if (e.keyCode == enterKey) {
      var $newline = $("<br/>", {class: "line"});
      window.getSelection().getRangeAt(0).insertNode($newline[0]);
      textnewLine("line");
      e.preventDefault();
    } else if (e.keyCode == spaceKey) {

              var child = $(this).children();
              var sel = window.getSelection();
              var anchorOffset = sel.anchorOffset;

              var node = window.getSelection().getRangeAt(0).commonAncestorContainer.parentNode;
              console.log(node);
              var index = child.index(node);

              var tmptext = $(child[index]).text();
              var x = tmptext.substring(0, anchorOffset) + " "  + tmptext.substring(anchorOffset);
              $(child[index]).text(x);
                // console.log(anchorOffset);
        textAddColor("editor", index);
    }

  });

      $("#CreateFile").submit(function(e) {
          e.preventDefault();
					var file ={};
					file.name = $("#filename").val();
					file.context = $("#editor").text();
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

			  $("#filelist").on("click", "button", (e)=> {
					var filename = e.target.id;
					$("#filename").val(filename);
					socket.emit("fileRead", filename);
				});

				socket.on("fileLoad", (data)=>{
          var tmp = data.replace(/\n/g,"<br class='line'/>");
          // console.log(tmp);
					$("#editor").find("br").html("&nbsp;&SmallCircle;&nbsp;");
          $("#editor").html(tmp);

          textnewLine("line");
          textAddColor("editor", 0);
				});
});
