// client index.js
'use strict';

// console.log(socket);
// var a = new t(socket);
var columns = [{
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
      title: 'Ports(hiden)'
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
      title: 'HostConfig(hiden)'
  }, {
      field: 'NetworkingSettings',
      title: 'NetworkingSettings(hiden)'
  }, {
      field: 'Mounts',
      title: 'Mounts(hiden)'
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
    var $container = $(".jsonTable");
    var $detail = $(".detail");
    var $list = $(".portlists");
    var portlists= [];

    var containerTable = new table($container, columns);
    function detailFormatter() {

    };
    containerTable.initUrlTable('/myapp/container/data.json', detailFormatter);
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

        initDropdown('/myapp/images/data.json', $(".dropdown-menu"), $image, "RepoTags", 0);
        var button = dialogbutton('Create', 'btn-primary create',
                  function(dialogItself){

                      var image = $image.text().trim();
                      var name = $name.val();
                      var cmd = $command.val();
                      var opts = containerSettings(image, name, command, portlists);
                      formAction($("#CreateContainer"), opts, socket,
                      (data)=>  {
                        containerTable.reload();
                        dialogShow("컨테이너", data);
                      });
                  }
      );

      dialogShow("컨테이너 생성", $form.show(), button);

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



  var completeEvent = function(table, data, callback){
    console.log(arguments);
     table.reload();
     var msg = "id : " + (data.msg)[0].id + "작업 완료";
     dialogShow("컨테이너", msg);
     callback;
  }

    $(".start").click((e)=>{
      client.socketTableEvent("StartContainer", containerTable, completeEvent);
    });

    $(".stop").click((e)=>{
        client.socketTableEvent("StopContainer", containerTable, completeEvent);
    });

    $(".remove").click((e)=>{
        client.socketTableEvent("RemoveContainer", containerTable, completeEvent);
    });

    $(".kill").click((e)=>{
        client.socketTableEvent("KillContainer", containerTable, completeEvent);
    });

    $(".pause").click((e)=>{
        client.socketTableEvent("PauseContainer", containerTable, completeEvent);
    });

    $(".unpause").click((e)=>{
        client.socketTableEvent("UnpauseContainer", containerTable, completeEvent);
    });


});
