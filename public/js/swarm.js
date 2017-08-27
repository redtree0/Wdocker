"use strict";

const swarmColumns = [ {
      field: 'status',
      title: '상태',
      halign : "center",
      align : "center",
      width : "5%",
      formatter : function (value , row, index){
        // console.log(row);
        var status = "<span class='glyphicon glyphicon-record text-success'></span>";
        return status;
      }
    },  {
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
    var swarmToken = {};
    var managerinfo = null;
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
            if(json.statusCode === 503){
              alert("swarm 구성 필요합니다.");
            }else {
              $(".token").append(addNewRow("manager"));
              $("#manager").append(createElement("<button/>", indexCol + " btn btn-primary", "Manager", "Manager"));
              $("#manager").append(addRowText(dataCol, json.JoinTokens.Manager, "managerToken"));
              $(".token").append(addNewRow("worker"));
              $("#worker").append(createElement("<button/>", indexCol + " btn btn-default", "Worker", "Worker"));
              $("#worker").append(addRowText(dataCol, json.JoinTokens.Worker, "workerToken"));
              swarmToken.manager = json.JoinTokens.Manager;
              swarmToken.worker = json.JoinTokens.Worker;

              $.getJSON('/myapp/node/data.json', function(json, textStatus) {
                for(var i in json){
                  if(json[i].hasOwnProperty("ManagerStatus")){
                    if(json[i].ManagerStatus.Leader === true){
                      managerinfo = (json[i].ManagerStatus.Addr);
                    }
                  }
                }
              });
            }
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
    // $all.form = {};
    $all.event = {};
    function clickDefault(client, eventName, table){
      return function(){
        client.sendEventTable(eventName, table);
      };
    }
    var config = require("./module/config");

    $all.event.init = {
        $button : $(".init"),
        eventName : "InitSwarm",
        clickEvent : function(client, eventName, table){
          return function(){
            var $swarmPort = $("#swarmPort");
            config.setSwarmInit({port : $swarmPort.val()});
            var opts = config.getSwarmInit();
            // console.log(opts);
            client.sendEvent(eventName , opts, ()=>{
              refresh();
            });

          }
        }
    };

    $all.event.leave = {
        $button : $(".leave"),
        eventName : "LeaveSwarm",
        clickEvent : function(client, eventName, table){
          return function(){
            client.sendEvent(eventName , true, ()=>{
              setTimeout(()=>{location.reload(true)}, 3000);
            });
            }
        }
    };

    $all.event.remove = {
        $button : $(".delete"),
        eventName : "RemoveNode",
        clickEvent : clickDefault
    };

    $all.event.update = {
        $button : $(".update"),
        eventName : "UpdateNode",
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


    $all.completeEvent = function(data, callback){
      // console.log(arguments);
      if(hasValue(data)){
        var dialog = require("./module/dialog.js");

        var finished = new dialog("Swarm & Node", data);
        finished.setDefaultButton('Close[Enker]', 'btn-primary create');
        finished.show();
        $all.table.main.$table.bootstrapTable('refresh');
        callback;
      }
    };

      var main = require("./module/main.js");
      main.init($all);


  var swarmTable = main.getSubTable();
  var client = main.getSocket();
  var dialog = main.getDialog();


  var rows = swarmTable.$table.bootstrapTable('getData');
  rows.forEach((row)=>{
    console.log(row);
    var opts = {
      host : row.ip,
      port : row.port,
    };
    // client.onlySendEvent("PING", opts,(data)=>{
    //   var status = null;
    //   if(data.err) {
    //     status = "<span class='glyphicon glyphicon-record text-danger'></span>";
    //   } else {
    //     status = "<span class='glyphicon glyphicon-record text-success'></span>";
    //   }
    //   console.log(data);
    //   return status;
    // });

  });

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
            ip : row.ip,
            port : row.port,
            managerPort : managerinfo.split(":")[1]
          }
          if(joinType === "worker"){
            opts.token = swarmToken.worker;
          }else if(joinType === "manager"){
            opts.token = swarmToken.manager;
          }

          console.log(joinType);
          config.setSwarmJoin(opts);
          var opts = config.getSwarmJoin();
          client.sendEvent("JoinSwarm" , opts, (data)=>{
            console.log(data);
          });
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
