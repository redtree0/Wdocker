"use strict";

const columns = [{
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
  }
  , {
    field: 'PING',
    title: 'PING',
    halign : "center",
    align : "center",
    width : "5%",
    formatter : function (value , row, index){
      return "<button type='button' class='btn btn-success ping'>PING</button>"
    }
  } , {
      field: 'remove',
      title: '',
      halign : "center",
      align : "center",
      width : "5%",
      formatter : function (value , row, index){
        return "<button type='button' class='btn btn-danger remove'><span class='glyphicon glyphicon-remove'></span></button>"
      }
    }];

$(function(){

      $('.ip_address').mask('0ZZ.0ZZ.0ZZ.0ZZ', { translation: { 'Z': { pattern: /[0-9]/, optional: true } } });
      var $all = {};
      $all.init = function(){};
      // $all.form = {};
      $all.table = {};
      $all.table.main = {
        $table : $(".jsonTable"),
        columns : columns,
        jsonUrl : '/myapp/settings/data.json',
        isExpend : false,
        clickRow : function  (e, row, $element, field) {
          var dialog = require("./dialog.js");
          var socket = io();
          var Socket = require("./io");
          var client = new Socket(socket, $('body'));

            if(field === "PING"){
                var opts = {
                  host : row.ip,
                  port : row.port,
                }
              console.log(opts);
              client.sendEvent("PING", opts,(data)=>{
                var finished = null;
                if(data.err) {
                  finished = new dialog("PING ERROR",  data.err.code, $("body"));
                } else {
                  finished = new dialog("PING OK",  data.data, $("body"));
                }
                finished.setDefaultButton('Close[Enker]', 'btn-primary create');
                finished.show();
                finished.close(5000);
              });
            }else if(field === "remove"){
              var opts = {
                _id : row._id,
              }
              console.log(opts);
              client.sendEventTable("DELETE", $(".jsonTable"), opts, (data)=>{
                var finished = new dialog("삭제", data, $("body"));
                finished.setDefaultButton('Close[Enker]', 'btn-primary create');
                finished.show();
              });
            }
          }
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


});
