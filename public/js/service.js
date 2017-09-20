'use strict';


const columns = [{
      checkbox: true,
      title: 'Check'
  },{
      field: 'ID',
      title: 'ID'
  },{
      field: 'Version.Index',
      title: 'Version'
  }, {
      field: 'Spec.Name',
      title: 'Name'
  }, {
      field: 'Spec.Labels',
      title: '라벨',
      formatter : function (value , row, index){
        return JSON.stringify(value);
      }
  },{
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

  const COMPLETE = {
    DO : true,
    NOT : false
  }

  var dialog = require("./module/dialog.js");

  var $all = {};

  $all.init = function(){
    $(".results").hide();
    isSwarm();
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
      "Replicas" : parseInt(self.$replicas.val()),
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

  $all.form.create.labellists = [];
  $all.form.create.$labelAdd = $("#labelAdd");
  $all.form.create.$labellists = $("#labellists");

  $all.form.create.loaded = function(client){
      console.log(client);
      var host = client.getToken();
      var jsonUrl = "/myapp/node/data/" + host;
      $.getJSON(jsonUrl, function(json, textStatus) {
            if(json.hasOwnProperty("statusCode") && json.statusCode !== 200){
                var msg = new dialog("서비스", "Swarm Leader or Manager 아닙니다.");
                msg.show();
                refresh();
            }
      });
      // "/myapp/node/data/" + host
      return ;
      refresh();
  };

  $all.form.create.initDropdown = function(self, host){
    var self = self.data;
    // console.log(self);
    var jsonUrl = null
    var local = getHostIP();
    if(host === null || host === undefined){
      jsonUrl = "/myapp/image/data/" + local;
    }else {
      jsonUrl = "/myapp/image/data/" + host;
    }
    var $contextMenu =   self.$imageMenu;
    var $dropDown =   self.$image;
    var attr = "RepoTags";
    var index = 0;
    initDropdown(jsonUrl, $contextMenu, $dropDown,{ "attr" :  attr, "index" : index });

    if(host === null || host === undefined){
      jsonUrl = "/myapp/network/data/" + local;
    }else {
      jsonUrl = "/myapp/network/data/" + host;
    }
    var $contextMenu =   self.$networkMenu;
    var $dropDown =   self.$network;
    var attr = "Name";
    // var index = 0;
    var opts = {
      "attr" :  attr,
      "filter" : {
        "key" : "Driver",
        "value" : "overlay"
      }
    };
    initDropdown(jsonUrl, $contextMenu, $dropDown, opts);
  }

  $all.connect = {};

  $all.table = {};
  $all.table.main = {
    $table : $(".jsonTable"),
    hideColumns : ["Id", "ImageID", "Ports", "Mounts", "HostConfig", "NetworkingSettings"],
    columns : columns,
    jsonUrl : '/myapp/service/data/' + getHostIP(),
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



  $all.completeEvent = function(data, callback){
      if(hasValue(data)){

        var finished = new dialog("서비스", data);
        finished.setDefaultButton('Close[Enker]', 'btn-primary create');
        finished.show();
        callback;
    }
  };

    var main = require("./module/main.js");
    main.init($all);


});
