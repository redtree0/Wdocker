"use strict";
const columns = [{
      checkbox: true,
      title: 'Check'
  },{
      field: 'ip',
      title: 'IP',
      sortable : true,
      halign : "center",
      align : "center"
  }, {
      field: 'port',
      title: 'Port',
      sortable : true,
      halign : "center",
      align : "center"
  },{
      field: 'type',
      title: 'Swarm Type',
      halign : "center",
      align : "center",
      width : "5%",
      formatter : function (){

      return   "<label class='checkbox-inline'><input type='checkbox' id='swarmtype' checked data-toggle='toggle' data-on='manager' data-off='worker' data-onstyle='success' data-offstyle='danger'></input></label>" ;
      }
  }, {
      field: 'join',
      title: 'Swarm Join',
      halign : "center",
      align : "center",
      width : "5%",
      formatter : function (){
        return "<button type='button' class='btn btn-primary join'>join</button>"
      }
  }, {
      field: 'leave',
      title: 'Swarm Leave',
      halign : "center",
      align : "center",
      width : "5%",
      formatter : function (){
        return "<button type='button' class='btn btn-danger leave'>leave</button>"

      }
  }
  ];

$(function(){
    var socket = io();
    var Socket = require("./io");
    var client = new Socket(socket, $('body'));
    var spin = require("./spinner");
    var table = require("./table.js");
    var dialog = require("./dialog.js");
    var $ip = $("#host");
    var $port = $("#port");
    var $user = $("#user");
    var $passwd = $("#password");
    var $privateKey = $("privateKey");
    var $list = $(".addlist");
    var $token = $("#tokenType");
    var $settings = $(".jsonTable");
    var settingsTable = new table($settings, columns);
    var swarmToken ={
      manager : null,
      worker : null
    }

    settingsTable.initUrlTable('/myapp/settings/data.json', false);
    settingsTable.checkAllEvents();
    $settings.on("click-cell.bs.table", function (e, field, value, row, $element) {

      if ($element.children('button').prop('tagName') === 'BUTTON') {
        // $(':checkbox', $element).trigger('click');
        console.log("clicked");
      }
    });
    // settingsTable.clickRow($detail);
    settingsTable.clickRowAddColor("danger");
  $('.ip_address').mask('0ZZ.0ZZ.0ZZ.0ZZ', { translation: { 'Z': { pattern: /[0-9]/, optional: true } } });


  $("#swarmInit").submit(()=>{
    var $swarmPort = $("#swarmPort");

    client.sendEvent("swarmInit" ,$swarmPort.val(), ()=>{});
  });

  $("#swarmLeave").submit((e)=>{
    e.preventDefault();
    var $force = $("#force").prop('checked') ? false : true;
    console.log($force);
    client.sendEvent("swarmLeave" , $force, ()=>{});
  });


  $(".leave").click((e)=>{
    e.preventDefault();

      console.log("clicked");
  });
  $(".join").click((e)=>{
    if(swarmToken){
      var opts = {
        lists : settingsTable.checkedRowLists,
        token : swarmToken
      }
      if($("#swarmtype").prop('checked')){
        opts.type = "manager"
      }else {
        opts.type = "worker"
      }
      client.sendEvent("swarmJoin" , opts, ()=>{});
    }
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
            if(opts.tokenType == "Worker") {
              opts.token = $("#workerToken").text();
            } else if ((opts.tokenType == "Manager")){
              opts.token = $("#managerToken").text();
            }
            console.log(opts.token);
            socket.emit("sshConnection" , opts);
        }
    });


    $.getJSON('/myapp/swarm/data.json', function(json, textStatus) {
      function addRowText( _class,  _text, _id){
        return $('<div/>', { class: _class, text: _text, id : _id  });
      }
      function addNewRow( _id ){
        return $('<div/>', { class: "row", id : _id });
      }

      var indexCol = "col-md-2";
      var dataCol = "col-md-10";

      swarmToken.manager = json.JoinTokens.Manager;
      swarmToken.worker = json.JoinTokens.Worker;

      $(".token").append(addNewRow("manager"));
      $("#manager").append(createElement("<button/>", indexCol + " btn btn-primary", "Manager", "Manager"));
      $("#manager").append(addRowText(dataCol, json.JoinTokens.Manager, "managerToken"));
      $(".token").append(addNewRow("worker"));
      $("#worker").append(createElement("<button/>", indexCol + " btn btn-default", "Worker", "Worker"));
      $("#worker").append(addRowText(dataCol, json.JoinTokens.Worker, "workerToken"));
    });
});
