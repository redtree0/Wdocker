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


function containerSettings ($image, $name, $cmd, $containerPort, $hostPort, $protocol){

  var opts = containerDefaultSettings();

    if($image.text().trim() == "Images"){
      return false;
    }
    if(!$name.val()){
      return false;
    }
    if(!$cmd.val()) {
      return false;
    }
    if($containerPort.val()){
      var portinfo = $containerPort.val() +"/"+ ($protocol.prop('checked').toString() ? "tcp" : "udp");

      opts.ExposedPorts[portinfo] = {};
      if($hostPort.val()){
        opts.HostConfig.PortBindings[portinfo] = [{ "HostPort" : $hostPort.val()}];
        }
      }

    opts.Image = $image.text().trim();
    opts.name = $name.val();
    opts.Cmd.push($cmd.val());

  // console.log(opts);
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
          $command, $containerPort, $hostPort, $protocol);

      formSubmit($("#CreateContainer"), opts, socket,
          ()=> { reloadTable($container); dialogShow("title", "message")}
      );
      //  console.log(socket);
    });






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
