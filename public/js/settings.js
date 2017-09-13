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
      const COMPLETE = {
        DO : true,
        NOT : false
      }


      $('.ip_address').mask('0ZZ.0ZZ.0ZZ.0ZZ', { translation: { 'Z': { pattern: /[0-9]/, optional: true } } });
      var $all = {};
      $all.init = function(){
            $.getJSON("/myapp/auth/data.json",(data)=>{
              $("#user").val(data[0].user);
              $("#password").val(data[0].password);
              $("#email").val(data[0].email);
            });
      };
      // $all.form = {};
      $all.table = {};
      $all.table.main = {
        $table : $(".jsonTable"),
        columns : columns,
        jsonUrl : '/myapp/settings/data.json',
        isExpend : false,
        clickRow : function  (e, row, $element, field) {
          var dialog = require("./module/dialog.js");
          var socket = io();
          var Socket = require("./module/io");
          var client = new Socket(socket, $('body'));

            if(field === "PING"){
                var opts = {
                  host : row.ip,
                  port : row.port,
                }
              client.sendEvent(COMPLETE.NOT, "PING", opts,(data)=>{
                var finished = null;

                finished = new dialog("PING OK",  data);
                finished.setDefaultButton('Close[Enker]', 'btn-primary create');
                finished.show();
                // finished.close(5000);
              });
            }else if(field === "remove"){
              var opts = {
                _id : row._id,
              }
              client.sendEventTable("DELETE", $(".jsonTable"), opts, (data)=>{
                var finished = new dialog("삭제", data);
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
      var main = require("./module/main.js");
      main.init($all);

      var client = main.getSocket();
      var dialog = main.getDialog();
      $("#authCheck").click((e)=>{
        var opts = {
          user : $("#user").val(),
          password : $("#password").val()
        }
          client.sendEvent(COMPLETE.NOT, "authCheck", opts, (data)=>{
            var finished = new dialog("Authentication",  data);
            finished.show();
          });
      });

});
