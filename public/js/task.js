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
    title: '이미지',
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
  $all.init = function(){};

  // $all.connect = {};
  // $all.connect.dockerinfo = "task";
  $all.table = {};
  $all.table.main = {
    $table : $(".jsonTable"),
    // hideColumns : ["Id", "ImageID", "Ports", "Mounts", "HostConfig", "NetworkingSettings"],
    columns : columns,
    jsonUrl : '/myapp/task/data.json',
  };
  var main = require("./main.js");
  main.init($all);


    $.getJSON("/myapp/service/data.json", (data)=>{
      console.log(data[0].Endpoint.Ports);
    });
    $.getJSON("/myapp/node/data.json", (data)=>{
      var nodeCount = 0;
      console.log(data.length);
      var col = null;
      if(data.length === 1) {
         col = "col-md-12";
      } else if(data.length === 2 || data.length === 4) {
         col = "col-md-6";
      } else if(data.length === 3 || data.length >= 5) {
         col = "col-md-4";
      }
        for(var i in data){
          nodeCount++;
          console.log(data[i]);
          var nodeID = data[i].ID;
          var hostname = data[i].Description.Hostname;
          var hostIP = data[i].Status.Addr;State
          var State = data[i].Status.State;
          $(".dockerNode").append($("<div/>").attr({
            class : "alert alert-success " + col,
            id : nodeID
          }).text(nodeID + " " + hostname + " "+ hostIP + " " + State) );
        }
        console.log(nodeCount);
        $.getJSON("/myapp/task/data.json", (data)=>{
            // console.log(JSON.stringify(data));
            for(var i in data){
              // console.log("ID");
              // console.log(data[i].ID);
              //
              // console.log("ServiceID");
              //
              // console.log(data[i].ServiceID);
              // console.log("nodeID");
              // console.log(data[i].NodeID);
              // console.log("Image");
              // console.log(data[i].Spec.ContainerSpec.Image);
              // console.log("Command");
              // console.log(data[i].Spec.ContainerSpec.Command);
              // console.log("state");
              // console.log(data[i].Status.State);
              // console.log("Network Addr");
              // console.log(data[i].NetworksAttachments["0"].Addresses["0"]);
              //
              // console.log("Network");
              // console.log(data[i].NetworksAttachments["0"].Network.Spec.Name);
              var nodeID =data[i].NodeID;
              var insert = "<br/>" + data[i].Spec.ContainerSpec.Image + " "
                    + data[i].Spec.ContainerSpec.Command + " " + data[i].Status.State
                    + " " + data[i].NetworksAttachments["0"].Addresses["0"]
                    + " " + data[i].NetworksAttachments["0"].Network.Spec.Name;
              var task = $("<div/>").attr({
                      class : "alert alert-info",
                    }).text(insert);
              $("#" + nodeID).append(task);
            }
        });

    });

});
