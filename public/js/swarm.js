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
      title: 'Node ID',
      halign : "center",
      align : "center"
  }, {
      field: 'CreatedAt',
      title: '생성일',
      halign : "center",
      align : "center"
  }, {
      field: 'Spec.Role',
      title: 'Role',
      halign : "center",
      align : "center"
  }, {
      field: 'Version.Index',
      title: '버전',
      halign : "center",
      align : "center"
  }, {
      field: 'Spec.Availability',
      title: 'Availability',
      halign : "center",
      align : "center"
  }, {
      field: 'Description.Hostname',
      title: 'Hostname',
      halign : "center",
      align : "center"
  }, {
      field: 'Description.Platform.Architecture',
      title: 'Architecture',
      halign : "center",
      align : "center"
  }, {
      field: 'Description.Platform.OS',
      title: 'OS',
      halign : "center",
      align : "center"
  }, {
      field: 'ManagerStatus.Addr',
      title: 'Manager IP',
      halign : "center",
      align : "center"
  }, {
      field: 'Status.State',
      title: '상태',
      halign : "center",
      align : "center"
  }, {
      field: 'Status.Addr',
      title: '호스트 IP',
      halign : "center",
      align : "center"
  }];


$(function(){
    $('.ip_address').mask('0ZZ.0ZZ.0ZZ.0ZZ', { translation: { 'Z': { pattern: /[0-9]/, optional: true } } });
    var $all = {};
    $all.init = function(){
        initDropdownArray(["Active", "Pause", "Drain"], $(".dropdown-menu") , $("#availability"));

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
    };


    $all.table = {};
    $all.table.main = {
      $table : $("#nodeTable"),
      columns : nodeColumns,
      hideColumns : ["CreatedAt"],
      jsonUrl : '/myapp/node/data.json',
      isExpend : false
    };
    $all.table.sub = {
      $table : $("#swarmTable"),
      columns : swarmColumns,
      jsonUrl : '/myapp/settings/data.json',
    }
    $all.event = {};
    function clickDefault(client, eventName, table){
      return function(){
        client.sendEventTable(eventName, table);
      };
    }

    $all.event.remove = {
        $button : $(".delete"),
        eventName : "RemoveNode",
        clickEvent : clickDefault
    };

    $all.event.update = {
        $button : $(".update"),
        eventName : "RemoveNode",
        clickEvent : function(client, eventName, table){
          var opts = {
              "lists" : table.checkedRowLists,
              "Availability" : $("#availability").text().trim()
          };
          return function(){
            client.sendEventTable(eventName, table, opts);
          }
        }
    };

    // $(".init").click((e)=>{
    //   e.preventDefault();
    //   var $swarmPort = $("#swarmPort");
    //   client.sendEvent("swarmInit" ,$swarmPort.val(), ()=>{});
    // });
    // $(".update").click((e)=>{
    //   var opts = {
    //     "lists" : nodeTable.checkedRowLists,
    //     "Availability" : $("#availability").text().trim()
    //   };
    //   console.log($("#availability").text().trim());
    //     client.sendEventTable("UpdateNode", nodeTable, opts);
    // });

    //
    $all.completeEvent = function(data, callback){
      console.log(arguments);
      if(hasValue(data)){
        var finished = new dialog("NODE", JSON.stringify(data), $("body"));
        finished.setDefaultButton('Close[Enker]', 'btn-primary create');
        finished.show();
        callback;
      }
    };

      var main = require("./main.js");
      main.init($all);


  var swarmTable = main.getSubTable();
  var client = main.getSocket();

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

  //
  //

  //
  // $(".leave").click((e)=>{
  //   e.preventDefault();
  //   client.sendEvent("swarmLeave" , true, ()=>{});
  // });
  //
  // $(".start").click((e)=>{
  //     client.sendEventTable("StartNode", nodeTable);
  // });
  //
  // $(".delete").click((e)=>{
  //     client.sendEventTable("RemoveNode", nodeTable);
  // });
  //

  //
  //


});
