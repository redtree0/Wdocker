'use strict';

var socket = io();

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

// function jstreeList(json, parentid, lists){
//   if (json === null) return null;
//
//   var ID = function () {
//     return '_' + Math.random().toString(36).substr(2, 9);
//   };
//   console.log(JSON.stringify(json));
//   var data = function (id, text, parent) {
//     this.id = id;
//     this.text = text;
//     this.parent = parent;
//   };
//   data.prototype.getJSON = function() {
//     var self = this;
//     return { id : self.id, text : self.text, parent : self.parent};
//   }
//
//   if(parentid == null) {
//     var parentid = ID(json.name);
//     var root = new data(parentid, json.name,"#");
//
//     lists.push(root.getJSON());
//   }
//
//   var child = json.children;
//   if(typeof child == undefined) {
//     return null;
//   }
//
//   for(var i in child) {
//     var leaf = new data(ID(child[i].name), child[i].name,parentid);
//     var leafNode = leaf.getJSON();
//     if(child[i].hasOwnProperty("extension")){
//       leafNode.icon = "glyphicon glyphicon-file"
//     }
//     lists.push(leafNode);
//     jstreeList(child[i], leaf.id, lists);
//
//   }
// }

$(function(){
  var socket = io();
  var Socket = require("./io");
  var client = new Socket(socket, $('body'));
  var spin = require("./spinner");

var table = require("./table.js");
var dialog = require("./dialog.js");

var $volume = $(".jsonTable");
var volumeTable = new table($volume, columns);
function detailFormatter() {

};
volumeTable.initUrlTable('/myapp/volume/data.json', detailFormatter);
// volumeTable.hideColumns(["Id", "ImageID", "Ports", "Mounts", "HostConfig", "NetworkingSettings"]);
volumeTable.checkAllEvents();
// volumeTable.clickRow($detail);
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
  //  var popup = new dialog("컨테이너 생성", $form.show(), $("body"));
   //
  //  initDropdown('/myapp/image/data.json', $(".dropdown-menu"), $image, "RepoTags", 0);
  //  popup.appendButton('Create', 'btn-primary create',
  //              function(dialogItself){
   //
  //                  var image = $image.text().trim();
  //                  var name = $name.val();
  //                  var command = $command.val();
  //                  var opts = containerSettings(image, name, command, portlists);
  //                  client.socketEvent("CreateContainer", opts, containerTable, completeEvent);
  //              });
   //
  //  popup.show();
   var popup = new dialog("볼륨 생성", $form.show(), $("body"));

     popup.appendButton('Create', 'btn-primary create',
               function(dialogItself){
                  var name = $name.val();
                  var driver = $driver.text().trim();
                   var opts = volumeSettings(name, driver);
                   client.socketEvent("CreateVolume", opts, volumeTable, completeEvent);

               });
    popup.show();

  });

  function socketEvent(eventName, checkedRowLists, callback){
    socket.emit(eventName, checkedRowLists, (data)=>{
      checkedRowLists.splice(0,checkedRowLists.length);
      callback(volumeTable, data);
    });
  }
  function completeEvent(table, data){
    //  table.reload();
    //  var msg = "id : " + (data.msg)+ "작업 완료";
    //  dialogShow("볼륨", msg);

     if(hasValue(table, data)){
       table.reload();

       var finished = new dialog("볼륨", data.msg + data.statusCode, $("body"));
       finished.setDefaultButton('Close[Enker]', 'btn-primary create');
       finished.show();

       callback;
     }
  }

  $(".remove").click((e)=>{
    if(hasValue(volumeTable.checkedRowLists)){
      console.log(volumeTable.checkedRowLists);
      socketEvent("RemoveVolume", volumeTable.checkedRowLists, completeEvent);
    }
  });


});
