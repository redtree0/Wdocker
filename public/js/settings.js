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
  }];

$(function(){

  $('.ip_address').mask('0ZZ.0ZZ.0ZZ.0ZZ', { translation: { 'Z': { pattern: /[0-9]/, optional: true } } });
  var $all = {};
  $all.init = function(){};
  $all.form = {};
  $all.table = {};
  $all.table.main = {
    $table : $(".jsonTable"),
    columns : columns,
    jsonUrl : '/myapp/settings/data.json',
  };
  $all.event = {};
  function clickDefault(client, eventName, table){
    return function(){
      client.sendEventTable(eventName, table);
    };
  }
  $all.event.remove = {
      $button : $(".remove"),
      eventName : "DELETE",
      clickEvent : clickDefault
  };
  var main = require("./main.js");
  main.init($all);
    var socket = io();
    var Socket = require("./io");
    var client = new Socket(socket, $('body'));
    var spin = require("./spinner");
    var table = require("./table.js");
    var $settings = $(".jsonTable");
    var dialog = require("./dialog.js");


      $(".ping").click((e)=>{
        client.completeEvent = function (data, callback) {
          if(hasValue(data)){

            var finished = null;
            if(data.err) {
              finished = new dialog("PING ERROR",  data.err.code, $("body"));
            } else {
              finished = new dialog("PING OK",  data.data, $("body"));
            }
            finished.setDefaultButton('Close[Enker]', 'btn-primary create');
            finished.show();
            finished.close(5000);
            callback;
          }
        }
        client.sendEventTable("PING", settingsTable);
      });
      $(".remove").click((e)=>{
        client.completeEvent = function( data, callback){
          if(hasValue(data)){
            var finished = new dialog("삭제", data, $("body"));
            finished.setDefaultButton('Close[Enker]', 'btn-primary create');
            finished.show();

            callback;
          }
        }
        client.sendEventTable("DELETE", settingsTable);
      });


});
