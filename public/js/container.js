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

  socket.on("errCatch", (err)=> {
    alert(JSON.stringify(err));
      if(err.statusCode == "409") {
        alert(err.json.message);
      }
  });

    initDropdown('/myapp/images/data.json', $(".dropdown-menu"), $("#image"));

    initUrlTable('ctable', columns,'/myapp/container/data.json');

    $(".create").click((e)=>{

      var opts = containerSettings($('#image'), $("#name"),
          $("#command"), $("#containerPort"), $("#hostPort"), $("#protocol"));

      formSubmit($("#CreateContainer"), opts, socket,
          ()=> { reloadTable('ctable'); dialogShow("title", "message")}
      );
      //  console.log(socket);
    });



    clickTableRow('ctable', 'detail');

    checkOneTable('ctable', dstack);
    uncheckOneTable('ctable', dstack);
    checkAlltable('ctable', dstack);
    uncheckAlltable('ctable', dstack);


    $(".ctlbtn").click(function() {
          var doIt =$(this).attr('id');
          // console.log(dstack);
          socket.emit(doIt, dstack);
          doneCatch(socket, ()=>{
            dstack= new Array();
          });
          reloadTable("ctable");
    });
});
