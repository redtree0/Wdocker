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

    var socket = io();
    var Socket = require("./io");
    var client = new Socket(socket, $('body'));
    var spin = require("./spinner");
    var table = require("./table.js");
    var $settings = $(".jsonTable");
    var dialog = require("./dialog.js");

    var settingsTable = new table($settings, columns);

    settingsTable.initUrlTable('/myapp/settings/data.json', false);
    settingsTable.checkAllEvents();
    // settingsTable.clickRow($detail);
    settingsTable.clickRowAddColor("danger");


    // var opts = {
    //   "lists" : settingsTable.checkedRowLists
    // }




    var opts = {
      "table" : settingsTable,
      "lists" : settingsTable.checkedRowLists
    }
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
