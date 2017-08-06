"use strict";

const swarmColumns = [  {
      field: 'ip',
      title: '호스트 IP',
      sortable : true,
      halign : "center",
      align : "center"
    }, {
      field: 'port',
      title: '호스트 Port',
      sortable : true,
      halign : "center",
      align : "center"
    },{
      title: 'Swarm Role',
      width : "5%",
      formatter : function (value , row, index){
        var toggle = "<input class='joinType'"+ "id='joinType" + index  +"' type='checkbox' data-toggle='toggle'>";

        return toggle;
      }
    }, {
      field: 'join',
      title: 'Swarm Join',
      halign : "center",
      align : "center",
      width : "5%",
      formatter : function (value , row, index){
        return "<button type='button' class='btn btn-primary join'>join</button>"
      }
    },{
      title: 'leave 유형',
      width : "5%",
      formatter : function (value , row, index){
        var toggle = "<input class='leaveType'"+ "id='leaveType" + index  +"' type='checkbox' data-toggle='toggle'>";

        return toggle;
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
    }];


const nodeColumns = [{
      checkbox: true,
      title: 'Check'
  },{
      field: 'ID',
      title: 'ID'
  }, {
      field: 'CreatedAt',
      title: '생성일'
  }, {
      field: 'Spec.Role',
      title: 'Role'
  }, {
      field: 'Version.Index',
      title: '버전'
  }, {
      field: 'Spec.Availability',
      title: 'Availability'
  }, {
      field: 'Description.Hostname',
      title: 'Hostname'
  }, {
      field: 'Description.Platform.Architecture',
      title: 'Architecture'
  }, {
      field: 'Description.Platform.OS',
      title: 'OS'
  }, {
      field: 'ManagerStatus.Addr',
      title: 'Manager IP'
  }, {
      field: 'Status.State',
      title: '상태'
  }, {
      field: 'Status.Addr',
      title: '호스트 IP'
  }];


$(function(){
    $('.ip_address').mask('0ZZ.0ZZ.0ZZ.0ZZ', { translation: { 'Z': { pattern: /[0-9]/, optional: true } } });

    var socket = io();
    var Socket = require("./io");
    var client = new Socket(socket, $('body'));
    var spin = require("./spinner");
    var table = require("./table.js");
    var dialog = require("./dialog.js");
    var $node = $("#nodeTable");
    var nodeTable = new table($node, nodeColumns);

    nodeTable.initUrlTable('/myapp/node/data.json', false );
    nodeTable.checkAllEvents();
    nodeTable.clickRowAddColor("danger");

    var $swarm = $("#swarmTable");
    var swarmTable = new table($swarm, swarmColumns);


    swarmTable.initUrlTable('/myapp/settings/data.json', false );
    swarmTable.checkAllEvents();
    swarmTable.clickRowAddColor("danger");

    swarmTable.$table.on("post-body.bs.table" , function(){
      $('.joinType').bootstrapToggle({
          on: 'Manager',
          off: 'Worker',
          onstyle : 'info',
          offstyle : 'defalt'
        });
        $('.leaveType').bootstrapToggle({
            on: 'Force',
            off: 'Unforce',
            onstyle : 'danger',
            offstyle : 'default'
          });
    });

    swarmTable.$table.on("click-row.bs.table", function (e, row, $element, field) {
      var parTr =  $element.closest('[data-index]').data('index');
      var joinType = ($("#joinType"+parTr).prop("checked") ? "manager" : "worker");
      var leaveType = ($("#leaveType"+parTr).prop("checked") ? true : false  );
      // console.log($element);
      // console.log(field);
      // console.log($element.prop("button"));
      if(field === "join"){
        if( joinType !== null){
          var opts = {
            host : row.ip,
            port : row.port,
            type : joinType
          }

          client.sendEvent("swarmJoin" , opts, ()=>{});
        }
      }else if(field === "leave"){
        var opts = {
          host : row.ip,
          port : row.port,
          type : leaveType
        }
        client.sendEvent("throwNode" , opts, ()=>{});
      }
    });



  $(".init").click((e)=>{
    e.preventDefault();
    var $swarmPort = $("#swarmPort");
    client.sendEvent("swarmInit" ,$swarmPort.val(), ()=>{});
  });

  $(".leave").click((e)=>{
    e.preventDefault();
    client.sendEvent("swarmLeave" , true, ()=>{});
  });

  $(".start").click((e)=>{
      client.sendEventTable("StartNode", nodeTable);
  });

  $(".delete").click((e)=>{
      client.sendEventTable("RemoveNode", nodeTable);
  });

  $(".update").click((e)=>{
    var opts = {
      "lists" : nodeTable.checkedRowLists,
      "Availability" : $("#availability").text().trim()
    };
    console.log($("#availability").text().trim());
      client.sendEventTable("UpdateNode", nodeTable, opts);
  });

  initDropdownArray(["Active", "Pause", "Drain"], $(".dropdown-menu") , $("#availability"));

  client.completeEvent = function(data, callback){
    if(hasValue(data)){
      var finished = new dialog("노드", data, $("body"));
      finished.setDefaultButton('Close[Enker]', 'btn-primary create');
      finished.show();
      nodeTable.reload();
      callback;
    }
  }
    $.getJSON('/myapp/swarm/data.json', function(json, textStatus) {
      function addRowText( _class,  _text, _id){
        return $('<div/>', { class: _class, text: _text, id : _id  });
      }
      function addNewRow( _id ){
        return $('<div/>', { class: "row", id : _id });
      }

      var indexCol = "col-md-2";
      var dataCol = "col-md-10";

      $(".token").append(addNewRow("manager"));
      $("#manager").append(createElement("<button/>", indexCol + " btn btn-primary", "Manager", "Manager"));
      $("#manager").append(addRowText(dataCol, json.JoinTokens.Manager, "managerToken"));
      $(".token").append(addNewRow("worker"));
      $("#worker").append(createElement("<button/>", indexCol + " btn btn-default", "Worker", "Worker"));
      $("#worker").append(addRowText(dataCol, json.JoinTokens.Worker, "workerToken"));
    });
});
