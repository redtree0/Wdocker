// network.js
"use strict";
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
    console.log(arguments);
    var config = require("./config");

    if(!hasValue(name, internal)) {
      return false;
    }
    if(driver === "driver") {
      console.log("a");
      return false;
    }

    config.setNetwork({"Name" : name, "Driver" : driver, "internal" : internal});

    return  config.getNetwork();
  }

$(function(){
  var socket = io();
  var Socket = require("./io");
  var client = new Socket(socket, $('body'));
  var spin = require("./spinner");
  var dialog = require("./dialog");

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
// initDropdown("/myapp/container/data.json", $('#container_list'), $("#container"), "Names", checkAddColor);
  initDropdown("/myapp/container/data.json", $('#container_list'), $("#container"), "Names");


  var $form = $("#CreateNetwork");
  $form.hide();
  $(".plus").click((e)=>{
    e.preventDefault();
    var popup = new dialog("네트워크 생성", $form.show(), $("body"));

    initDropdownArray(["bridge", "overlay", "macvlan"], $("#driver_list") , $("#driver"));
    popup.appendButton('Create', 'btn-primary create',
                function(dialogItself){

                  var name = $("#name").val();
                  var driver = $('#driver').text().trim();
                  var internal = $("#internal").prop('checked');

                  var opts = networkSettings(name, driver, internal);
                  console.log(opts);
                    client.socketEvent("CreateNetwork", opts,  networkTable, completeEvent);

                }
    );

    popup.show();

  })


  var completeEvent = function(table, data, callback){
    // if(hasValue(table, data)){
      table.reload();

      var finished = new dialog("네트워크", data.msg + data.statusCode, $("body"));
      finished.setDefaultButton('Close[Enker]', 'btn-primary create');
      finished.show();

      callback;
    // }
  }


  $("#remove").click(()=>{
    var opts = {
      "table" : networkTable,
      "lists" : networkTable.checkedRowLists
    }
    client.socketTableEvent("RemoveNetwork", opts, completeEvent);
  });
  $("#connect").click((e)=>{
    e.preventDefault();
      if( $('#container').text().trim() != "Containers") {
        var opts = {
          "table" : networkTable,
          "lists" : networkTable.checkedRowLists,
          "container" : $('#container').text().trim()
        };
        console.log(opts);

        // opts.container = $('#container').text().trim();
        // console.log(opts);
        client.socketTableEvent("ConnectNetwork", opts, completeEvent);
      }
  });
  $("#disconnect").click(()=>{
    var opts = {
      "table" : networkTable,
      "lists" : networkTable.checkedRowLists
    }
    if( $('#container').text().trim() != "Containers") {
        opts.container = $('#container').text().trim();
        client.socketTableEvent("DisconnectNetwork", opts, completeEvent);
    }
  });


});
