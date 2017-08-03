'use strict';

var columns = [
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
        title: '옵션'
    }, {
        field: 'Scope',
        title: "스코프"
    }
];


$(function(){
  var socket = io();
  var Socket = require("./io");
  var client = new Socket(socket, $('body'));
  var spin = require("./spinner");

  var table = require("./table.js");
  var dialog = require("./dialog.js");

  var $volume = $(".jsonTable");
  var volumeTable = new table($volume, columns);

  volumeTable.initUrlTable('/myapp/volume/data.json', false);
  volumeTable.checkAllEvents();
  volumeTable.clickRowAddColor("danger");
  var $form = $("#CreateVolume");
    $form.hide();
  //

  function volumeSettings( name, driver ){
    var config = require("./config");
      if(driver == "Images"){
        return false;
      }
      if (hasValue(name)) {
        config.setVolume({"Name" : name, "Driver" : driver});
     };
     return config.getVolume();
  }
   $(".plus").click((e)=>{
     e.preventDefault();
     var $name = $("#name");
     var $driver = $("#driver");
     initDropdownArray(["local"], $("#driver_list"), $("#driver"));


     var popup = new dialog("볼륨 생성", $form.show(), $("body"));

       popup.appendButton('Create', 'btn-primary create',
                 function(dialogItself){
                    var name = $name.val();
                    var driver = $driver.text().trim();
                     var opts = volumeSettings(name, driver);
                     client.sendEventTable("CreateVolume", volumeTable, opts);

                 });
      popup.show();

    });


  client.completeEvent = function (data, callback){
     if(hasValue(data)){

       var finished = new dialog("볼륨", data.msg + data.statusCode, $("body"));
       finished.setDefaultButton('Close[Enker]', 'btn-primary create');
       finished.show();

       callback;
     }
  }

  $(".remove").click((e)=>{
    if(hasValue(volumeTable.checkedRowLists)){
      console.log(volumeTable.checkedRowLists);
      client.sendEventTable("RemoveVolume", volumeTable);
    }
  });


});
