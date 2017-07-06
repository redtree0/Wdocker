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
      field: 'IPAM.Config',
      title: 'Config'
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

  function networkSettings($name, $driver, $internal) {

    var opts = networkDefaultSettings();
    if(!$name.val()) {
      return false;
    }
    if($driver.text().trim() == "driver") {
      return false;
    }
    opts.Name = $name.val();
    opts.driver = $driver.text().trim();
    opts.internal = $internal.prop('checked');
    console.log(opts);
    return opts;
  }

$(function(){
  var checklist =[];
  var $network = $(".jsonTable");
  var $detail = $(".detail");

  initUrlTable($network, columns, "/myapp/network/data.json");

  clickTableRow($network, $detail);

  checkTableEvent($network, checklist);

  clickRowAddColor($network, "danger");
// (text) => {checkAddColor('networklist', text, "success");}
  initDropdown("/myapp/container/data.json", $('#container_list'), $("#container"), "Names", checkAddColor);
  initDropdownArray(["bridge", "overlay", "macvlan"], $("#driver_list") , $("#driver"));
  // clickDropdown("container");

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


  $(".create").click((e)=>{

    var opts = networkSettings($("#name"), $('#driver'), $("#internal"));

    formSubmit($("#CreateNetwork"), opts
       , socket, ()=> { reloadTable('networklist'); dialogShow("title", "message")});
   });
});
