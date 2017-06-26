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
  function initDropdown(url) {
    $.getJSON(url, function(json, textStatus) {

      json.forEach ( (data) => {
          $("<li><a>" +  data.Names + "</a><li/>").appendTo('ul.dropdown-menu');
      });
    //    console.log(textStatus);
    });
  }

  function clickDropdown(id) {
    $(".dropdown-menu").on("click", "li a", function(event){
          $('#container').text($(this).text());
          checkAddColor('networklist', $(this).text(), "success");
      });
  }

$(function(){
  var checklist =[];
  initUrlTable("networklist", columns, "/myapp/network/data.json");

  clickTableRow('networklist', 'detail');

  checkOneTable('networklist', checklist);
  uncheckOneTable('networklist', checklist);
  checkAlltable('networklist', checklist);
  uncheckAlltable('networklist', checklist);
  clickRowAddColor('networklist', "danger");

  initDropdown("/myapp/container/data.json");
  clickDropdown("container");

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
  $("#CreateNetwork").submit(function(e) {
    e.preventDefault();
    var $name=$("#name");
    var $driver =$('#driver');
    var $internal = $("#internal");

    var _name = $name.val();
    //  var _driver = $image.text().trim();
    var _driver = $driver.val();
    // var _internal = $internal.prop('checked').toString();
    var _internal = $internal.prop('checked');
    //console.log(images.trim());

    var opts = {
      Name : _name,
      Driver: _driver,
      // Internal: _internal,
      Internal: false,
      Ingress : false,
      Attachable : false,
      IPAM : {
        // "Driver": _driver,
        "Config": [
        {
            "Subnet": "192.168.0.0/24",
            "IPRange": "192.168.0.0/24"
             ,"Gateway": "192.168.0.100"
        }]

      },
      "Options": {
                "com.docker.network.bridge.default_bridge": "true",
                "com.docker.network.bridge.enable_icc": "true",
                "com.docker.network.bridge.enable_ip_masquerade": "true",
                "com.docker.network.bridge.host_binding_ipv4": "0.0.0.0",
                // "com.docker.network.bridge.name": "k",
                "com.docker.network.driver.mtu": "1500"
              }
    }
    // 서버로 메시지를 전송한다.
    console.log(opts);
    socket.emit("CreateNetwork", opts);
    $name.val("");
    $driver.val("");

  });
});
