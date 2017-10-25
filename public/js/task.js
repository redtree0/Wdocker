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

  const COMPLETE = {
    DO : true,
    NOT : false
  }

  var $all = {};
  $all.init = function(){
    isSwarm();
    loadTask(getHostIP());

  };

  $all.connect = {};
  $all.connect.dockerinfo = "node";

  $all.table = {};
  $all.table.main = {
    $table : $(".jsonTable"),
    columns : columns,
    jsonUrl : '/myapp/task/data/' + getHostIP(),
  };

  $all.table.main.loaded = function(client, host, networkTable){
    $("#refresh").off();

    $("#refresh").click((e)=>{
      loadTask(host);
    });
  }

  var main = require("./module/main.js");
  main.init($all);

  function loadTask(host) {
    var hostId = getHostId(host);
    $(".dockerNode").children().remove();
    var nodeUrl = "/myapp/node/data/" + hostId;
    $.getJSON( nodeUrl, (data)=>{
      // console.log(data);
      if(data.hasOwnProperty("statusCode")){
        if(data.statusCode !== 200){
          var errormsg = "It is not Swarm Manager"
          $(".dockerNode").append($("<div/>").attr({
            class : "alert alert-danger",
          }).html(errormsg) );
          return;
        }
      }
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
      // console.log(data);
      for(var i in data){
        // console.log(data[i]);
        console.log("doFor");
        var role = data[i].Spec.Role;
        var nodeID = data[i].ID;
        var hostname = data[i].Description.Hostname;
        var hostIP = data[i].Status.Addr;
        var State = data[i].Status.State;

        var msg =  "[Node]"
        + " <br/> Role : "+ role
        + " <br/> NodeID : "+ nodeID
        + " <br/> Host : " + hostname
        + " <br/> IP : "+ hostIP
        + " <br/> State : " + State;
          // text-left form-group
        $(".dockerNode").append($("<div/>").attr({
          class : "alert alert-success node col-md-4",
          id : nodeID
        }).html(msg) );
      }
      var taskUrl = "/myapp/task/data/" + hostId;

      $.getJSON(taskUrl , (data)=>{
        // console.log(data);
        if(data.hasOwnProperty("json") && data.json.hasOwnProperty("message")){

          $(".dockerNode").text(data.json.message);

        }else {

          for(var i in data){
            var taskinfo =   data[i];

            var networkinfo = "";
            if(taskinfo.hasOwnProperty("NetworksAttachments")){
              networkinfo =  " <br/> IP : " + taskinfo.NetworksAttachments["0"].Addresses["0"]
              + "<br/> Network : " + taskinfo.NetworksAttachments["0"].Network.Spec.Name;
            }
            var insert = "[Task]"
            + " <br/> Image : " + taskinfo.Spec.ContainerSpec.Image.split("@")["0"]
            + " <br/> Version : " + taskinfo.Version.Index
            + " <br/> Command : " + taskinfo.Spec.ContainerSpec.Command
            +  " <br/> State : " + taskinfo.Status.State
            + networkinfo;
            // console.log(insert);
            // console.log(nodeID);
            var task = $("<div/>").attr({
              class : "alert alert-info",
            }).html(insert);
            $("#" + nodeID).append(task);
            if($("#" + nodeID).children().length > 0){
              $("#" + nodeID).css("height", "auto");
            }
            // }
          }
        }
      });

    });
  }

});
