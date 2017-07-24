// network.js
"use strict";
var socket = io();
var columns = [{
      checkbox: true,
      title: 'Check'
  },{
      field: 'Name',
      title: '네트워크 명',
      sortable : true,
      halign : "center",
      align : "center"
  },{
      field: 'Id',
      title: '네트워크 Id',
      sortable : true,
      halign : "center",
      align : "center"
  },{
      field: 'Created',
      title: '네트워크 생성일'
  },{
      field: 'Scope',
      title: 'Scope'
  },{
      field: 'Driver',
      title: 'Driver'
  },{
      field: 'EnableIPv6',
      title: 'EnableIPv6'
  },{
      field: 'IPAM',
      title: 'IPAM'
  },{
      field: 'IPAM.Config.0.IPRange',
      title: 'IPRange',
      sortable : true,
      halign : "center",
      align : "center"
  },{
      field: 'IPAM.Config.0.Subnet',
      title: 'Subnet',
      sortable : true,
      halign : "center",
      align : "center"
  },{
      field: 'IPAM.Config.0.Gateway',
      title: 'Gateway',
      sortable : true,
      halign : "center",
      align : "center"
  },{
      field: 'Internal',
      title: 'Internal'
  },{
      field: 'Attachable',
      title: 'Attachable'
  },{
      field: 'Containers',
      title: 'Containers'
  },{
      field: 'Options',
      title: 'Options'
  },{
      field: 'Labels',
      title: 'Labels'
  }];


  function clickDropdown(id) {
    $("#container_list").on("click", "li a", function(event){
          $('#container').text($(this).text());
          checkAddColor('networklist', $(this).text(), "success");
      });


  }

  function networkSettings(name, driver, internal) {

    var config = require("./config");

    if(hasValue(name, internal)) {
      return false;
    }
    if(driver == "driver") {
      return false;
    }

    config.setNetwork({"Name" : name, "driver" : driver, "internal" : internal});

    return  config.getNetwork();
  }

$(function(){
  var checklist =[];
  var $network = $(".jsonTable");
  var $detail = $(".detail");

  var table = require("./table.js");

  var networkTable = new table($network, columns);
  function detailFormatter() {

  };
  networkTable.initUrlTable('/myapp/network/data.json', detailFormatter);
  networkTable.hideColumns(["EnableIPv6", "Labels", "IPAM", "Containers", "Options", "Created", "Id"]);
  networkTable.checkAllEvents();
  networkTable.clickRow($detail);
  networkTable.clickRowAddColor("danger");


  var expandinfo = [{
    url : "/myapp/network/",
    keys : ["Containers", "Name", "Id", "Driver"]
  }];
  networkTable.expandRow(expandinfo);
//   initUrlTable($network, columns, "/myapp/network/data.json");
//
//   clickTableRow($network, $detail);
//
//   checkTableEvent($network, checklist);
//
//   clickRowAddColor($network, "danger");
// initDropdown("/myapp/container/data.json", $('#container_list'), $("#container"), "Names", checkAddColor);
  initDropdown("/myapp/container/data.json", $('#container_list'), $("#container"), "Names");
  // clickDropdown("container");



  var $form = $("#CreateNetwork");
  $form.hide();
  $(".plus").click((e)=>{
    e.preventDefault();

    initDropdownArray(["bridge", "overlay", "macvlan"], $("#driver_list") , $("#driver"));
      var button = dialogbutton('Create', 'btn-primary create',
                function(dialogItself){

                  var name = $("#name").val();
                  var driver = $('#driver').text().trim();
                  var internal = $("#internal").prop('checked');

                  var opts = networkSettings(name, driver, internal);

                    formAction($("#CreateNetwork"), opts, socket,
                    (data)=>  {
                      networkTable.reload();
                      dialogShow("title", "message");
                    });
                }
    );

    dialogShow("네트워크 생성", $form.show(), button);

  })

  function socketEvent(eventName, checkedRowLists, callback){
    socket.emit(eventName, checkedRowLists, (data)=>{
      checkedRowLists.splice(0,checkedRowLists.length);

      callback(networkTable, data);
    });
  }

  function completeEvent(table, data){
     table.reload();
     console.log(data);
     var msg = "id : " + (data.msg) + "작업 완료";
     dialogShow("네트워크", msg);
  }


  $("#remove").click(()=>{
    if(hasValue(networkTable.checkedRowLists)){
      socketEvent("RemoveNetwork", networkTable.checkedRowLists, completeEvent);
    } else {
      alert("선택하시요.");
    }
  });
  $("#connect").click(()=>{
    if( $('#container').text().trim() != "Containers") {
      if(hasValue(networkTable.checkedRowLists)){

        socketEvent("ConnectNetwork", [networkTable.checkedRowLists, $('#container').text().trim()], completeEvent);
      }
    }
  });
  $("#disconnect").click(()=>{
    if( $('#container').text().trim() != "Containers") {
      if(hasValue(networkTable.checkedRowLists)){
        socketEvent("DisconnectNetwork", [networkTable.checkedRowLists, $('#container').text().trim()],completeEvent );
      }
    }

  });


  // $(".create").click((e)=>{
  //   var name = $("#name").val();
  //   var driver = $('#driver').text().trim();
  //   var internal = $("#internal").prop('checked');
  //
  //   var opts = networkSettings(name, driver, internal);
  //
  //   formSubmit($("#CreateNetwork"), opts
  //      , socket, ()=> { reloadTable('networklist'); dialogShow("title", "message")});
  //  });
});
