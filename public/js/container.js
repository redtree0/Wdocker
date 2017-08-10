// client index.js
'use strict';

// console.log(socket);
// var a = new t(socket);
const columns = [{
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
      title: '포트'
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
      title: 'HostConfig'
  }, {
      field: 'NetworkingSettings',
      title: 'NetworkingSettings'
  }, {
      field: 'Mounts',
      title: 'Mounts'
  }];


$(function(){
  var $all = {};
  $all.init = function(){};
  $all.form = {};
  $all.form.$form = $("#hiddenForm");
  $all.form.settingMethod = {
    get : "getContainer",
    set : "setContainer"
  };
  $all.form.getSettingValue = function(self) {
    var self = self.data ;
    return {
      Image : self.$image.text().trim(),
      name : self.$name.val(),
      Cmd : self.$command.val()
    }
  }
  $all.form.create = {};
  $all.form.create.data = {
    $imageMenu : $("#imageMenu"),
    $image : $('#imageDropDown'),
    $name : $("#name"),
    $command : $("#command")
  };
  $all.form.create.$newForm =  $(".newForm");
  $all.form.formName = "컨테이너 생성";
  $all.form.create.formEvent = "CreateContainer";
  $all.form.create.portlists = [];
  $all.form.create.$portAdd = $(".portAdd");
  $all.form.create.$portlists = $(".portlists");
  $all.form.create.dropDown = {
    $dropDown : $('#imageDropDown'),
    default : "Images"
  };

  $all.form.create.initDropdown = function(self){
    console.log(self);
    var self = self.data;
    console.log(self);
    var jsonUrl = '/myapp/image/data.json';
    var $contextMenu =   self.$imageMenu;
    var $dropDown =   self.$image;
    var attr = "RepoTags";
    var index = 0;
    return initDropdown(jsonUrl, $contextMenu, $dropDown, { attr : attr, index :  index} );
  }

  $all.connect = {};
  $all.connect.dockerinfo = "container";
  $all.table = {};
  $all.table.main = {
    $table : $(".jsonTable"),
    hideColumns : ["Id", "ImageID", "Ports", "Mounts", "HostConfig", "NetworkingSettings"],
    columns : columns,
    jsonUrl : '/myapp/container/data.json',
  };

  $all.event = {};
  function clickDefault(client, eventName, table){
    return function(){
      client.sendEventTable(eventName, table);
    };
  }
  $all.event.create = {
      $button : $(".create"),
      eventName : "CreateContainer",
      clickEvent : clickDefault
  };
  $all.event.start = {
      $button : $(".start"),
      eventName : "StartContainer",
      clickEvent : clickDefault
  };
  $all.event.stop = {
      $button : $(".stop"),
      eventName : "StopContainer",
      clickEvent : clickDefault
  };
  $all.event.remove = {
      $button : $(".remove"),
      eventName : "RemoveContainer",
      clickEvent : clickDefault
  };
  $all.event.kill = {
      $button : $(".kill"),
      eventName : "KillContainer",
      clickEvent : clickDefault
  };
  $all.event.pause = {
      $button : $(".pause"),
      eventName : "PauseContainer",
      clickEvent : clickDefault
  };
  $all.event.unpause = {
      $button : $(".unpause"),
      eventName : "UnpauseContainer",
      clickEvent : clickDefault
  };
  $all.completeEvent = function(data, callback){
    console.log(arguments);
    if(hasValue(data)){
      var dialog = require("./dialog.js");

      var finished = new dialog("컨테이너", data.msg + data.statusCode, $("body"));
      finished.setDefaultButton('Close[Enker]', 'btn-primary create');
      finished.show();

      callback;
    }
  };

    var main = require("./main.js");
    main.init($all);
    var containerTable = main.getMainTable();

    // var $detail = $("#detail");
    //
    // containerTable.clickRow($detail);
     var expandinfo = [{
       url : "/myapp/container/top/",
       keys : ["Titles", "Processes"]
     },{
       url : "/myapp/container/stats/",
       keys : ["id", "name", "memory_stats", "networks", "cpu_stats", "Ports"]
     }];
     containerTable.expandRow(expandinfo);


});
