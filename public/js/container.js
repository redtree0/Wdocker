// client index.js
'use strict';

var socket = io();

var columns = [{
      checkbox: true,
      title: 'Check'
  },{
      field: 'Id',
      title: 'Id'
  }, {
      field: 'Names',
      title: 'Item Names'
  }, {
      field: 'Image',
      title: 'Image'
  }, {
      field: 'ImageID',
      title: 'ImageID'
  }, {
      field: 'Command',
      title: 'Command'
  }, {
      field: 'Created',
      title: 'Created'
  }, {
      field: 'Ports',
      title: 'Ports'
  }, {
      field: 'Labels',
      title: 'Labels'
  }, {
      field: 'State',
      title: 'State'
  }, {
      field: 'Status',
      title: 'Status'
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

var dstack = [];


function containerSettings ($image, $name, $cmd, portArray){

  var opts = containerDefaultSettings();

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


$(function(){

    var $container = $(".jsonTable");
    var $image =$('#image');
    var $name = $("#name");
    var $command = $("#command");
    var $containerPort = $("#containerPort");
    var $hostPort = $("#hostPort");
    var $protocol = $("#protocol");
    var $detail = $(".detail");

    initDropdown('/myapp/images/data.json', $(".dropdown-menu"), $image, "RepoTags", 0);
    initUrlTable($container, columns,'/myapp/container/data.json');

    clickTableRow($container, $detail);
    clickRowAddColor($container, "danger");
    checkTableEvent($container, dstack);

    $(".create").click((e)=>{
      var opts = containerSettings($image, $name,
          $command, portlist);

      formSubmit($("#CreateContainer"), opts, socket,
          ()=> { reloadTable($container); dialogShow("title", "message")}
      );
      //  console.log(socket);
    });

    var portlist= [];
    var id = 0;

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
          addlist($array, $(".addlist") , id++, portlist);

        }
    });

        clickDeleteList($(".addlist"));




    $(".ctlbtn").click(function() {
          var doIt =$(this).attr('id');
          // console.log(dstack);
          socket.emit(doIt, dstack);
          doneCatch(socket, ()=>{
            dstack= new Array();
          });
          reloadTable($container);
    });
});
