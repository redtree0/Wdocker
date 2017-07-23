// network.js
"use strict";
var socket = io();
var columns = [{
      checkbox: true,
      title: 'Check'
  },{
      field: 'Name',
      title: 'Name'
  },{
      field: 'Id',
      title: 'Id'
  },{
      field: 'Created',
      title: 'Created'
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
      title: 'IPRange'
  },{
      field: 'IPAM.Config.0.Subnet',
      title: 'Subnet'
  },{
      field: 'IPAM.Config.0.Gateway',
      title: 'Gateway'
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
  networkTable.hideColumns(["EnableIPv6", "Labels", "IPAM", "Containers", "Options"]);
  networkTable.checkAllEvents();
  networkTable.clickRow($detail);
  networkTable.clickRowAddColor("danger");
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
                  console.log($("#driver_list"));
                  console.log($("#driver"));

                  var name = $("#name").val();
                  var driver = $('#driver').text().trim();
                  var internal = $("#internal").prop('checked');

                  var opts = networkSettings(name, driver, internal);

                    formAction($("#CreateNetwork"), opts, socket,
                    (data)=>  {
                      reloadTable($container);
                      dialogShow("title", "message");
                    });
                }
    );

    dialogShow("네트워크 생성", $form.show(), button);

  })


  $("#remove").click(()=>{
    console.log(checklist);
    socket.emit("RemoveNetwork", checklist);
  });
  $("#connect").click(()=>{
    if( $('#container').text().trim() != "Containers") {
        socket.emit("ConnectNetwork", checklist, $('#container').text().trim());
    }
  });
  $("#disconnect").click(()=>{
    if( $('#container').text().trim() != "Containers") {
        socket.emit("DisconnectNetwork", checklist, $('#container').text().trim());
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
