"use strict";

const columns = [{
    field: 'ID',
    title: '서비스 ID'
}, {
    field: 'Spec.ContainerSpec.Image',
    title: '이미지',
    sortable : true,
    halign : "center",
    align : "center"
}, {
    field: 'Spec.ContainerSpec.Command.0',
    title: '명령어',
    sortable : true,
    halign : "center",
    align : "center"
}, {
    field: 'NetworksAttachments.0.Network.Spec.Name',
    title: '네트워크',
    sortable : true,
    halign : "center",
    align : "center"
}, {
    field: 'NetworksAttachments.0.Network.IPAMOptions.Configs.0.Subnet',
    title: '네트워크 SubNet',
    sortable : true,
    halign : "center",
    align : "center"
}, {
    field: 'NetworksAttachments.0.Network.IPAMOptions.Configs.0.Gateway',
    title: '네트워크 G/W',
    sortable : true,
    halign : "center",
    align : "center"
}, {
    field: 'NetworksAttachments.0.Addresses.0',
    title: '네트워크 IP',
    sortable : true,
    halign : "center",
    align : "center"
}];

$(function(){


  var $all = {};
  $all.init = function(){
    isSwarm();
  };

  // $all.connect = {};
  // $all.connect.dockerinfo = "task";
  $all.table = {};
  $all.table.main = {
    $table : $(".jsonTable"),
    // hideColumns : ["Id", "ImageID", "Ports", "Mounts", "HostConfig", "NetworkingSettings"],
    columns : columns,
    jsonUrl : '/myapp/task/data.json',
  };
  var main = require("./module/main.js");
  main.init($all);


    $.getJSON("/myapp/service/data.json", (data)=>{
      console.log(data[0].Endpoint.Ports);
    });
    $.getJSON("/myapp/node/data.json", (data)=>{
      console.log(data.length);
      var col = null;
      if(data.length === 1) {
         col = "col-md-12";
      } else if(data.length === 2 || data.length === 4) {
         col = "col-md-6";
      } else if(data.length === 3 || data.length >= 5) {
         col = "col-md-4";
      }

      var rowIndex = 0;
      var data = (data.sort(function(a, b) {
            var nameA = a.Spec.Role.toUpperCase(); // ignore upper and lowercase
            var nameB = b.Spec.Role.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }

            // names must be equal
            return 0;
      }));
        for(var i in data){
          rowIndex = rowIndex++ / 3;
          console.log(data[i]);
          var role = data[i].Spec.Role;
          var nodeID = data[i].ID;
          var hostname = data[i].Description.Hostname;
          var hostIP = data[i].Status.Addr;State
          var State = data[i].Status.State;
          // $("#index" + rowIndex)
          var msg =  "[Node]"
              + " <br/> Role : "+ role
              + " <br/> NodeID : "+ nodeID
              + " <br/> Host : " + hostname
              + " <br/> IP : "+ hostIP
              + " <br/> State : " + State;

          $(".dockerNode").append($("<div/>").attr({
            class : "form-group alert alert-success node  text-left " + col,
            id : nodeID
          }).html(msg) );
        }
        $.getJSON("/myapp/task/data.json", (data)=>{
            // console.log(JSON.stringify(data));
            for(var i in data){

              var taskinfo =   data[i];
              var nodeID =taskinfo.NodeID;
              var insert = "[Task]"
               + " <br/> Image : " + taskinfo.Spec.ContainerSpec.Image.split("@")["0"]
               + " <br/> Command : " + taskinfo.Spec.ContainerSpec.Command
               +  " <br/> State : " + taskinfo.Status.State
               + " <br/> IP : " + taskinfo.NetworksAttachments["0"].Addresses["0"]
               + "<br/> Network : " + taskinfo.NetworksAttachments["0"].Network.Spec.Name;
              var task = $("<div/>").attr({
                      class : "alert alert-info text-left",
                    }).html(insert);
              $("#" + nodeID).append(task);
              if($("#" + nodeID).children().length > 0){
                $("#" + nodeID).css("height", "auto");
              }
            }
        });

    });

});
