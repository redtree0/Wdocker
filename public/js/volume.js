'use strict';

const columns = [
    {
        checkbox: true,
        title: 'Check'
    },{
        field: 'Driver',
        title: '드라이버',
        sortable : true,
        halign : "center",
        align : "center"
    }, {
        field: 'Name',
        title: '볼륨 명',
        sortable : true,
        halign : "center",
        align : "center"
    }, {
        field: 'Mountpoint',
        title: '마운트 포인트',
        sortable : true,
        halign : "center",
        align : "center"
    }, {
        field: 'Options',
        title: '옵션',
        halign : "center",
        align : "center"
    }, {
        field: 'Scope',
        title: "스코프",
        halign : "center",
        align : "center"
    }, {
        field: 'Labels',
        title: '라벨',
        halign : "center",
        align : "center",
        formatter : function (value , row, index){
          return JSON.stringify(value);
        }
    }
];


$(function(){

  const COMPLETE = {
    DO : true,
    NOT : false
  }

  var $all = {};
  $all.init = function(){};
  $all.form = {};
  $all.form.$form = $("#hiddenForm");
  $all.form.settingMethod = {
    get : "getVolume",
    set : "setVolume"
  };
  $all.form.getSettingValue = function(self) {
    var self = self.data ;
    return {
      "Name" : self.$name.val(),
      "Driver" : self.$driver.text().trim()
    }
  };
  $all.form.create = {};
  $all.form.create.data = {
    $driver : $("#driverDropdown"),
    $driverMenu : $("#driverMenu"),
    $name : $("#name")
  };
  $all.form.create.$newForm =  $(".newForm");
  $all.form.create.formName = "볼륨 생성";
  $all.form.create.formEvent = "CreateVolume";
  $all.form.create.labellists = [];
  $all.form.create.$labelAdd = $("#labelAdd");
  $all.form.create.$labellists = $("#labellists");

  //  $all.form.create.dropDown =  {
  //    $dropDown : $('#driverDropDown'),
  //    default : "driver"
  //  };
  $all.form.create.initDropdown = function(self){
    var self = self.data;
    var data = ["local"];
    var $contextMenu =   self.$driverMenu;
    var $dropDown =   self.$driver;

    return initDropdownArray(data, $contextMenu, $dropDown);
  }
  $all.connect = {};
  $all.connect.dockerinfo = "volume";
  $all.table = {};
  $all.table.main = {
    $table : $(".jsonTable"),
    columns : columns,
    jsonUrl : '/myapp/volume/data/' + getHostIP(),
  };
  $all.event = {};
  function clickDefault(client, eventName, table){
    return function(){
      client.sendEventTable(eventName, table);
    };
  }

  $all.event.remove = {
      $button : $(".remove"),
      eventName : "RemoveVolume",
      clickEvent : clickDefault
  };

  $all.completeEvent = function(data, callback){
      if(hasValue(data)){
          var dialog = require("./module/dialog.js");

           var finished = new dialog("볼륨", data);
           finished.setDefaultButton('Close[Enker]', 'btn-primary create');
           finished.show();

           callback;
         }
  };

    var main = require("./module/main.js");
    main.init($all);

});
