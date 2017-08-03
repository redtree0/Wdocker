// client index.js
'use strict';

// console.log(socket);
// var a = new t(socket);
const columns = [{
      checkbox: true,
      title: 'Check'
  },{
      field: 'Id',
      title: '컨테이너 ID'
  }, {
      field: 'Names',
      title: '컨테이너 명',
      sortable : true,
      halign : "center",
      align : "center"
  }, {
      field: 'Image',
      title: '이미지',
      sortable : true,
      halign : "center",
      align : "center"
  }, {
      field: 'ImageID',
      title: '이미지 ID'
  }, {
      field: 'Command',
      title: '실행 명령어',
      sortable : true,
      halign : "center",
      align : "center"
  }, {
      field: 'Created',
      title: '생성일'
  }, {
      field: 'Ports',
      title: '포트'
  }, {
      field: 'Labels',
      title: '라벨'
  }, {
      field: 'State',
      title: '상태',
      sortable : true,
      halign : "center",
      align : "center"
  }, {
      field: 'Status',
      title: '상황'
  }, {
      field: 'HostConfig',
      title: 'HostConfig'
  }, {
      field: 'NetworkingSettings',
      title: 'NetworkingSettings'
  }, {
      field: 'Mounts',
      title: 'Mounts'
  }];



function containerSettings (image, name, cmd, portArray){
  var config = require("./config");
  // var opts = settings.container;
    if(image == "Images"){
      return false;
    }
    if (hasValue(name, cmd)) {
      config.setContainer({"Image" : image, "name" : name, "Cmd" : cmd},
          portArray);
   };
  return  config.getContainer();
}


$(function(){
  var socket = io();
  var Socket = require("./io");
  var client = new Socket(socket, $('body'));
    var spin = require("./spinner");
    var table = require("./table.js");
    var dialog = require("./dialog.js");
    var $container = $(".jsonTable");
    var $detail = $(".detail");
    var $list = $(".portlists");
    var portlists= [];

    var containerTable = new table($container, columns);

    containerTable.initUrlTable('/myapp/container/data.json', true);
    containerTable.hideColumns(["Id", "ImageID", "Ports", "Mounts", "HostConfig", "NetworkingSettings"]);
    containerTable.checkAllEvents();
    containerTable.clickRow($detail);
    containerTable.clickRowAddColor("danger");
     var expandinfo = [{
       url : "/myapp/container/top/",
       keys : ["Titles", "Processes"]
     },{
       url : "/myapp/container/stats/",
       keys : ["id", "name", "memory_stats", "networks", "cpu_stats", "Ports"]
     }];
     containerTable.expandRow(expandinfo);


     var $form = $("#CreateContainer");
     $form.hide();
     clickDeleteList($list, portlists);
  //
    $(".plus").click((e)=>{
      e.preventDefault();
      var $image =$('#image');
      var $name = $("#name");
      var $command = $("#command");
      var dialog = require("./dialog");
      var popup = new dialog("컨테이너 생성", $form.show(), $("body"));

      initDropdown('/myapp/image/data.json', $(".dropdown-menu"), $image, "RepoTags", 0);
      popup.appendButton('Create', 'btn-primary create',
                  function(dialogItself){

                      var image = $image.text().trim();
                      var name = $name.val();
                      var command = $command.val();
                      var opts = containerSettings(image, name, command, portlists);
                      client.sendEventTable("CreateContainer", containerTable, opts);
                  });

      popup.show();

    });


  //
  //
    $(".portAdd").click((e)=>{
        e.preventDefault();
        var $protocol = $("#protocol");
        var $containerPort = $("#containerPort");
        var $hostPort = $("#hostPort");

        var $array = [$containerPort, $hostPort, $protocol];
        var state = true;
        for (var i in $array) {
          if(!(hasValue($array[i].val()))){
            state = false;
          }
        }
        if(state) {
          insertArray(portlists, $array);
          createList ( $list, portlists );
        }
    });
  //



  client.completeEvent = function(data, callback){
    if(hasValue(data)){
      var finished = new dialog("컨테이너", data.msg + data.statusCode, $("body"));
      finished.setDefaultButton('Close[Enker]', 'btn-primary create');
      finished.show();
      containerTable.reload();
      callback;
    }
  }


    $(".start").click((e)=>{
      client.sendEventTable("StartContainer", containerTable);
    });

    $(".stop").click((e)=>{
        client.sendEventTable("StopContainer", containerTable);
    });

    $(".remove").click((e)=>{
        client.sendEventTable("RemoveContainer", containerTable);
    });

    $(".kill").click((e)=>{
        client.sendEventTable("KillContainer", containerTable);
    });

    $(".pause").click((e)=>{
        client.sendEventTable("PauseContainer", containerTable);
    });

    $(".unpause").click((e)=>{
        client.sendEventTable("UnpauseContainer", containerTable);
    });


});
