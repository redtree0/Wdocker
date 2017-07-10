var socket = io();

$(function(){
    var $ip = $("#host");
    var $port = $("#port");
    var $user = $("#user");
    var $passwd = $("#password");
    var $privateKey = $("privateKey");
    var $list = $(".addlist");
    var $token = $("#token");

  $('.ip_address').mask('0ZZ.0ZZ.0ZZ.0ZZ', { translation: { 'Z': { pattern: /[0-9]/, optional: true } } });


  $("#swarmInit").submit(()=>{
    var $swarmPort = $("#swarmPort");

    socket.emit("swarmInit" ,$swarmPort.val());
  });

  $("#swarmLeave").submit((e)=>{
    e.preventDefault();
    var $force = $("#force").prop('checked') ? false : true;
    console.log($force);
    socket.emit("swarmLeave" , $force);
  });

  var sshlist = [];


  $(".add").click((e)=>{
      e.preventDefault();
      var $array = [$ip, $port, $user, $token];
      var state = true;
      for (var i in $array) {
        if(!(hasValue($array[i].val()))){
          state = false;
        }
      }
      if(state) {
        addDataArray(sshlist, $array);
        makeList( $list, sshlist) ;

      }
  });
    clickDeleteList($list, sshlist);


    $list.on('click', 'button', function(e){
    e.preventDefault();

    var id = "#row" + $(this).attr("id");
        if($(this).hasClass("connection")) {
            var opts = (sshlist[$(this).attr("id")]);
            socket.emit("sshConnection" , opts);
        }
    });


    $.getJSON('/myapp/swarm/data.json', function(json, textStatus) {
      function addRowText( _class,  _text){
        return $('<div/>', { class: _class, text: _text });
      }
      function addNewRow( _id ){
        return $('<div/>', { class: "row", id : _id });
      }

      var indexCol = "col-md-2";
      var dataCol = "col-md-10";
      var swarmToken = (json[json.length -1]);
      $(".token").append(addNewRow("manager"));
      $("#manager").append(createElement("<button/>", indexCol + " btn btn-primary", "Manager"));
      $("#manager").append(addRowText(dataCol, swarmToken.Manager));
      $(".token").append(addNewRow("worker"));
      $("#worker").append(createElement("<button/>", indexCol + " btn btn-default", "Worker"));
      $("#worker").append(addRowText(dataCol, swarmToken.Worker));
    });
});
