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


  var $all = {};
  $all.init = function(){
    $(".results").hide();
  };


  $all.form = {};
  $all.form.$form =  $("#hiddenForm");
  $all.form.settingMethod = {
    get : "getService",
    set : "setService"
  };
  $all.form.getSettingValue = function(getThis) {
    var self = getThis.data;
    return {
      "Image" : self.$image.text().trim(),
      "Name" : self.$name.val(),
      "Command" : self.$command.val(),
      "replicas" : self.$replicas.val(),
      "Network" : self.$network.text().trim()
    }
  };
  $all.form.create = {};
  $all.form.create.data = {
    $imageMenu : $("#imageMenu"),
    $image : $('#imageDropDown'),
    $networkMenu : $("#networkMenu"),
    $network : $('#networkDropDown'),
    $name : $("#serviceName"),
    $command : $("#command"),
    $replicas : $("#replicas")
  };
  $all.form.create.$newForm =  $(".newForm");
  $all.form.create.formName = "서비스 생성";
  $all.form.create.$form = $("#hiddenForm");
  $all.form.create.formEvent = "CreateService";
  $all.form.create.portlists = [];
  $all.form.create.$portAdd = $("#portAdd");
  $all.form.create.$portlists = $("#portlists");
  $all.form.create.dropDown = {
    $dropDown : $('#imageDropDown'),
    default : "Images"
  };


  $all.form.create.initDropdown = function(){
    var self = this;
    var jsonUrl = '/myapp/image/data.json';
    var $contextMenu =   self.data.$imageMenu;
    var $dropDown =   self.data.$image;
    var attr = "RepoTags";
    var index = 0;
    initDropdown(jsonUrl, $contextMenu, $dropDown,{ "attr" :  attr, "index" : index });

    var jsonUrl = '/myapp/network/data.json';
    var $contextMenu =   self.data.$networkMenu;
    var $dropDown =   self.data.$network;
    var attr = "Name";
    // var index = 0;
    initDropdown(jsonUrl, $contextMenu, $dropDown, { "attr" :  attr});
  }

  $all.form.update = {};
  $all.form.update.data = {
    $imageMenu : $("#imageMenu"),
    $image : $('#imageDropDownNew'),
    $networkMenu : $("#networkMenu"),
    $network : $('#networkDropDownNew'),
    $name : $("#serviceNameNew"),
    $command : $("#commandNew"),
    $replicas : $("#replicasNew")
  };
  $all.form.update.$form = $("#detail");
  $all.form.update.formEvent = "UpdateService";
  $all.form.update.portlists = [];
  $all.form.update.$portAdd = $("#portAddNew");
  $all.form.update.$portlists = $("#portlistsNew");



  $all.connect = {};
  $all.connect.dockerinfo = "service";
  $all.table = {};
  $all.table.main = {
    $table : $(".jsonTable"),
    hideColumns : ["Id", "ImageID", "Ports", "Mounts", "HostConfig", "NetworkingSettings"],
    columns : columns,
    jsonUrl : '/myapp/service/data.json',
  };

  $all.event = {};
  function clickDefault(client, eventName, table){
    return function(){
      client.sendEventTable(eventName, table);
    };
  }

  $all.event.remove = {
      $button : $(".remove"),
      eventName : "RemoveService",
      clickEvent : clickDefault
  };


  // $all.update = {};
  // $all.update = {
  //     $button : $("#update"),
  //     eventName : "RemoveService",
  //     clickEvent : clickDefault
  // };

  $all.completeEvent = function(data, callback){
      if(hasValue(data)){
        var dialog = require("./dialog.js");

        var finished = new dialog("서비스", data, $("body"));
        finished.setDefaultButton('Close[Enker]', 'btn-primary create');
        finished.show();
        callback;
    }
  };

    var main = require("./main.js");
    main.init($all);
  var serviceTable = main.getMainTable();

  var $detail = $("#detail");

  // serviceTable.clickRow($detail);
  // var clone = $("#hiddenForm").clone().attr("id", "updateForm");
  // var input = clone.find("input");
  // input.each((i, element )=>{
  //   var originId = $(element).attr("id");
  //   $(element).attr("id", originId + "New");
  // });
  // var button = (clone.find("button"));
  // button.each((i, element)=>{
  //   var originId = $(element).attr("id");
  //   $(element).attr("id", originId + "New");
  // });
  //
  // var div = (clone.find("div"));
  // div.each((i, element)=>{
  //   var originId = $(element).attr("id");
  //   $(element).attr("id", originId + "New");
  // });
  // clone.append($("<button/>").addClass("btn btn-primary").attr("id", "update").text("Update"));
  // $detail.append(clone);


  // var clone = $.extend({}, ("#hiddenForm")).attr("id", "updateForm");
  // serviceTable.$table.on('click-row.bs.table', function (r, e, f){
  //
  //   // var portlists = [];
  //   // clone.show();
  //   // $detail.children().show();
  //   var data = e;
  //
  //   $("#serviceNameNew").val(data.Spec.Name);
  //   $("#commandNew").val(data.Spec.TaskTemplate.ContainerSpec.Command);
  //   $("#replicasNew").val(data.Spec.Mode.Replicated.Replicas);
  //   // var portlists = new Array();
  //   // console.log(data.Spec.EndpointSpec.Ports);
  //   var portlistsNew = data.Spec.EndpointSpec.Ports.filter((val)=>{   delete val.PublishMode;  return val; });
  //   // delete portinfo.PublishMode;
  //   // portlists = (portinfo);
  //
  //     $.getJSON("/myapp/network/" + data.Spec.TaskTemplate.Networks["0"].Target, function(data){
  //       initDropdown("/myapp/network/data.json", $("#networkMenu"),  $("#networkDropDownNew"),
  //       {"attr" : "Name", "selected" : data.Name});
  //     });
  //   initDropdown("/myapp/image/data.json", $("#imageMenu"), $("#imageDropDownNew") ,
  //       {"attr" :  "RepoTags", "index" :  0, "selected" :  data.Spec.TaskTemplate.ContainerSpec.Image.split("@")[0]});
  //   var $portlistsNew = $("#portlistsNew");
  //   createList($portlistsNew, portlistsNew);
  //   clickDeleteList($portlistsNew, portlistsNew);
  //
  //   $("#portAddNew").click((e)=>{
  //     e.preventDefault();
  //     var $protocol =  $("#protocolNew");
  //     var $containerPort = $("#containerPortNew");
  //     var $hostPort = $("#hostPortNew");
  //
  //     var $array = [$containerPort, $hostPort, $protocol];
  //     var state = true;
  //     for (var i in $array) {
  //       if(!(hasValue($array[i].val()))){
  //         state = false;
  //       }
  //     }
  //     if(state) {
  //       // console.log(portlists);
  //       insertArray(portlistsNew, $array);
  //       createList ( $portlistsNew, portlistsNew );
  //     }
  //   });
  //
  // });




});
