'use strict';


const columns = [{
      checkbox: true,
      title: 'Check'
  },{
      field: 'ID',
      title: 'ID'
  }, {
      field: 'Spec.Name',
      title: 'Name'
  }, {
      field: 'Spec.TaskTemplate.ContainerSpec.Image',
      title: 'Image'
  }, {
      field: 'Spec.TaskTemplate.ContainerSpec.Command',
      title: 'Command'
  }, {
      field: 'Endpoint.Spec.Ports.0.Protocol',
      title: 'Protocol'
  }, {
      field: 'Endpoint.Spec.Ports.0.PublishedPort',
      title: 'PublishedPort'
  }, {
      field: 'Endpoint.Spec.Ports.0.TargetPort',
      title: 'TargetPort'
  }];

$(function(){
    var socket = io();
    var Socket = require("./io");
    var client = new Socket(socket, $('body'));
    var spin = require("./spinner");
    var table = require("./table.js");
    var dialog = require("./dialog.js");
    var $service = $(".jsonTable");

    var serviceTable = new table($service, columns);

    serviceTable.initUrlTable('/myapp/service/data.json', false);
    serviceTable.checkAllEvents();
    serviceTable.clickRowAddColor("danger");
    var $form = $("#CreateService");
    $form.hide();

  // initDropdown('/myapp/images/data.json', $(".dropdown-menu"), $('#image'), "RepoTags", 0);


  function serviceSettings (image, serviceName, command, portlists){

    var config = require("./config");
    // var opts = settings.container;
      if(image === "Images"){
        return false;
      }
      if (hasValue(serviceName, command)) {
        config.setService({"Image" : image, "Name" : serviceName, "Command" : command},
            portlists);
     };
     console.log(config.getService());
    return  config.getService();

  }

  $(".plus").click((e)=>{
    e.preventDefault();
    var $serviceName = $("#serviceName");
    var $image = $("#image");
    var $command = $("#command");
    var $healthCheck = $("#healthCheck");

    var popup = new dialog("서비스 생성", $form.show(), $("body"));

    initDropdown('/myapp/image/data.json', $(".dropdown-menu"), $image, "RepoTags", 0);
    popup.appendButton('Create', 'btn-primary create',
                function(dialogItself){
                    var serviceName = $serviceName.val() ;
                    var image = $image.text().trim();
                    var command = $command.val();
                    // var healthCheck = $healthCheck.prop("checked");

                    var opts = serviceSettings(image, serviceName, command, portlists);
                    client.sendEventTable("CreateService", serviceTable, opts);
                });
    popup.show();

  });

  client.completeEvent = function(data, callback){
    if(hasValue(data)){
      var finished = new dialog("서비스", data.msg + data.statusCode, $("body"));
      finished.setDefaultButton('Close[Enker]', 'btn-primary create');
      finished.show();
      serviceTable.reload();
      callback;
    }
  };

    $(".remove").click((e)=>{
      e.preventDefault();
      // console.log("remove get data");
      // // console.log(serviceTable.checkedRowLists.push({"d" : "d"}));
      // console.log(serviceTable.checkedRowLists);
      // console.log(JSON.stringify(serviceTable.checkedRowLists));
      // console.log(serviceTable);
        client.sendEventTable("RemoveService", serviceTable, ()=>{});
    });


    var portlists = [];
    var $list = $(".portlists");
    $(".portAdd").click((e)=>{
        e.preventDefault();
        var $publishedPort = $("#publishedPort");
        var $targetPort = $("#targetPort");
        var $protocol = $("#protocol");

        var $array = [$publishedPort,  $targetPort, $protocol];
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

    clickDeleteList($(".addlist"));


});
