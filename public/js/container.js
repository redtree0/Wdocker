// client index.js
'use strict';

var socket = io();

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



function containerSettings ($image, $name, $cmd, portArray){

  var opts = containerDefaultSettings();
  console.log(arguments);
    if($image.text().trim() == "Images"){
      return false;
    }
    if (hasValue($name.val(), $cmd.val(), portArray)) {

    for ( var i in portArray) {
      var portinfo = portArray[i].containerPort +"/"+ portArray[i].protocol;
      opts.ExposedPorts[portinfo] = {};
        opts.HostConfig.PortBindings[portinfo] = [{ "HostPort" : portArray[i].hostPort}];
    }


    opts.Image = $image.text().trim();
    opts.name = $name.val();
    opts.Cmd.push($cmd.val());
  }

   console.log(opts);
  return  opts;
}

function detailFormatter(index, row) {

}
$(function(){

    var $container = $(".jsonTable");
    var $image =$('#image');
    var $name = $("#name");
    var $command = $("#command");
    var $containerPort = $("#containerPort");
    var $hostPort = $("#hostPort");
    var $protocol = $("#protocol");
    var $detail = $(".detail");
    var $list = $(".addlist");
    var checklist = [];
    var $form = $("#CreateContainer");
    initDropdown('/myapp/images/data.json', $(".dropdown-menu"), $image, "RepoTags", 0);
    initUrlTable($container, columns,'/myapp/container/data.json', detailFormatter);
    $container.bootstrapTable("hideColumn", "Id");
    $container.bootstrapTable("hideColumn", "ImageID");
    $container.bootstrapTable("hideColumn", "Ports");
    $container.bootstrapTable("hideColumn", "Mounts");
    $container.bootstrapTable("hideColumn", "HostConfig");
    $container.bootstrapTable("hideColumn", "NetworkingSettings");
    $form.hide();
    clickTableRow($container, $detail);
    clickRowAddColor($container, "danger");
    checkTableEvent($container, checklist);
    clickDeleteList($list, portlist);
    $(".plus").click((e)=>{
      e.preventDefault();
      BootstrapDialog.show({
          title: "컨테이너 생성",
          message: $form.show(),
          onhide: function(dialogRef){
              //  var fruit = dialogRef.getModalBody().find('input').val();
              //  if($.trim(fruit.toLowerCase()) !== 'banana') {
              //      alert('Need banana!');
              //      return false;
              //  }
           },
          buttons: [ {
                label: 'Create',
                cssClass: 'btn-primary create',
                action: function(dialogItself){
                    var opts = containerSettings($image, $name, $command, portlist);
                    formAction($("#CreateContainer"), opts, socket,
                    (data)=>  {
                      console.log("reloa");
                      console.log(data);
                      reloadTable($container);
                      dialogShow("title", "message");
                    });
                }
            }, {
                label: 'Close',
                action: function(dialogItself){
                    dialogItself.close();
                }
            }]
      });
    })
    $container.on("expand-row.bs.table", function (e, index, row, $detail){
      // console.log(index);
      // console.log(row);
      var top = new Promise(function(resolve, reject) {
          $.getJSON("/myapp/container/top/"+ row.Id,  {}, function(json, textStatus) {
            console.log(JSON.stringify(json));
            var data = {};
            data.titles = json.Titles;
            data.processes = json.Processes;
            var detail = "";

            for(var i in data){
              if(data[i] == undefined || JSON.stringify(data[i])=='{}' || data[i].length == 0) {
              }else {
                detail += "<p> " + i +" : </p><p>" + JSON.stringify(data[i]) + "</p>";
              }
            }
            resolve(detail);

          });
      });
      var stats = new Promise(function(resolve, reject) {
          $.getJSON("/myapp/container/stats/"+ row.Id,  {}, function(json, textStatus) {
            // console.log(JSON.stringify(json));

            var data = {};
            data.id = json.id;
            data.name = json.name;
            data.memory = json.memory_stats;
            data.network = json.networks;
            data.cpu = json.cpu_stats;
            data.port = row.Ports;
            var detail = "";
            for(var i in data){
              if(data[i] == undefined || JSON.stringify(data[i])=='{}' || data[i].length == 0) {
              }else {
                detail += "<p> " + i +" : </p><p>" + JSON.stringify(data[i]) + "</p>";
              }
            }
            resolve(detail);
            // $detail.html(detail);
          });
      });
      Promise.all([top, stats]).then(function(value) {
        $detail.html(value);
      }, function(reason) {
        console.log(reason);
      });
    });

    $(".create").click((e)=>{

      var opts = containerSettings($image, $name, $command, portlist);

      formAction($("#CreateContainer"), opts, socket,
      (data)=>  {
        console.log("reloa");
        console.log(data);
        reloadTable($container);
        dialogShow("title", "message");
      });

    });

    var portlist= [];

    $(".add").click((e)=>{
        e.preventDefault();
        var $array = [$containerPort, $hostPort, $protocol];
        var state = true;
        for (var i in $array) {
          if(!(hasValue($array[i].val()))){
            state = false;
          }
        }
        if(state) {
          addDataArray(portlist, $array);
          makeList ( $list, portlist );
        }
    });

        // isFinished();

  function socketEvent(eventName, listArray){
    socket.emit(eventName, checklist, (data)=>{
      checklist.splice(0,checklist.length);
        reloadTable($container);
       dialogShow("title", data.msg);

    });
  }

    $(".start").click((e)=>{
                socketEvent("StartContainer", checklist);
    });

    $(".stop").click((e)=>{
        socketEvent("StopContainer", checklist);
    });

    $(".remove").click((e)=>{
        socketEvent("RemoveContainer", checklist);
    });

    $(".kill").click((e)=>{
        socketEvent("KillContainer", checklist);
    });

    $(".pause").click((e)=>{
        socketEvent("PauseContainer", checklist);
    });

    $(".unpause").click((e)=>{
        socketEvent("UnpauseContainer", checklist);
    });


});
