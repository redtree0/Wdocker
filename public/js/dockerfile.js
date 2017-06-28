$(function(){
  var socket = io();

  $("#editor").on("keydown keyup", function(e){
    // $(".newline").append("<span>&NewLine;</span>");
    console.log("do");
    $(".line").html("&NewLine;");
    if (e.keyCode == 13){

      var $newline = $('<span/>', { class: "newline"});

      window.getSelection().getRangeAt(0).insertNode($newline[0]);
      $newline.html("&NewLine;");

    }
    else if (e.keyCode == 32){
      console.log("text %s", $(this).html());
			 var text = $(this).text().replace(/[\s]+/g, " ").trim();

      //  var text = $(this).text().replace(/[\s]+/g, " ");
       var word = text.split(" ");
       console.log("word");
       console.log(word);
        //  var word = text;
        var newHTML = "";

        $.each(word, function(index, value){
            console.log("word : %s",value);
            switch(value.toUpperCase()){
                case "SELECT":
                case "FROM":
                case "WHERE":
                case "LIKE":
                case "BETWEEN":
                case "NOT LIKE":
                case "FALSE":
                case "NULL":
                case "FROM":
                case "TRUE":
                case "NOT IN":
                    newHTML += "<span class='statement'>" + value + "&nbsp;</span>";
                    break;
                // case "13":
                //     console.log("enter");

                default:
                    newHTML += "<span class='other'>" + value + "&nbsp;</span>";
            }
        });
        console.log("html");
        console.log(newHTML);
      	$(this).html(newHTML);

        //// Set cursor postion to end of text
        var child = $(this).children();
        var range = document.createRange();
        var sel = window.getSelection();
        range.setStart(child[child.length - 1], 1);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        $(this)[0].focus();
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
					console.log("createfile");
					console.log(file.context);
          socket.emit("CreateFile", file);
      });
			function addFileList( _class,  _text){
				return $('<button/>', { class: _class, text: _text , id: _text});
			}
			var file =[];
			$.getJSON("/myapp/dockerfile/data.json", function(json, textStatus) {
				json.forEach((data)=>{
					console.log(data);
					file = data;
					 $("#filelist").append(addFileList("btn btn-success file", data.name));
				});
			});
			  $("#filelist").on("click", "button", (e)=> {
					var filename = e.target.id;
					$("#filename").val(filename);

					socket.emit("fileRead", filename);
				});
				socket.on("fileLoad", (data)=>{

          var tmp = data.replace(/\n/g,"<br class='line'/>");
          // var text = ;
					$("#editor").html(tmp);
				});
})
