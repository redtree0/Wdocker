// network.js
"use strict";
const columns = [{
      checkbox: true,
      title: 'Check'
  },{
      field: 'Name',
      title: '네트워크 명',
      sortable : true,
      halign : "center",
      align : "center"
  },{
      field: 'Id',
      title: '네트워크 Id',
      sortable : true,
      halign : "center",
      align : "center"
  },{
      field: 'Created',
      title: '네트워크 생성일'
  },{
      field: 'Scope',
      title: 'Scope'
  },{
      field: 'Driver',
      title: 'Driver'
  },{
      field: 'EnableIPv6',
      title: 'EnableIPv6'
  },{
      field: 'IPAM',
      title: 'IPAM'
  },{
      field: 'IPAM.Config.0.IPRange',
      title: 'IPRange',
      sortable : true,
      halign : "center",
      align : "center"
  },{
      field: 'IPAM.Config.0.Subnet',
      title: 'Subnet',
      sortable : true,
      halign : "center",
      align : "center"
  },{
      field: 'IPAM.Config.0.Gateway',
      title: 'Gateway',
      sortable : true,
      halign : "center",
      align : "center"
  },{
      field: 'Internal',
      title: 'Internal'
  },{
      field: 'Attachable',
      title: 'Attachable'
  },{
      field: 'Containers',
      title: 'Containers'
  },{
      field: 'Options',
      title: 'Options'
  },{
      field: 'Labels',
      title: 'Labels'
  }];


  // function clickDropdown(id) {
  //   $("#container_list").on("click", "li a", function(event){
  //         $('#container').text($(this).text());
  //         checkAddColor('networklist', $(this).text(), "success");
  //     });
  //
  //
  // }


$(function(){

  $('.ip_address').mask('0ZZ.0ZZ.0ZZ.0ZZ/00', { translation: { 'Z': { pattern: /[0-9]/, optional: true } } });

  var $all = {};
  $all.init = function(){
    var self = this;
    var jsonUrl = '/myapp/container/data.json';
    var $contextMenu = $("#containerMenu")  ;
    var $dropDown =   $("#containerDropDown");
    var attr = "Names";
    // var index = 0;
    return initDropdown(jsonUrl, $contextMenu, $dropDown, {attr : attr});
  };
  $all.form = {};
  $all.form.$form = $("#hiddenForm");
  $all.form.settingMethod = {
    get : "getNetwork",
    set : "setNetwork"
  };
  $all.form.getSettingValue = function(self) {
    var self = self.data ;
    var opts = {
      Name : self.$name.val(),
      Driver : self.$driver.text().trim(),
      internal : self.$internal.prop('checked')
    };

    if(self.$ipRange !== null && self.$subnet !== null && self.$gateway !== null){
      opts.ipRange = self.$ipRange.val();
      opts.subnet = self.$subnet.val();
      opts.gateway = self.$gateway.val();
    }

    return opts;

  };
  $all.form.create = {};
  $all.form.create.data = {
    $name : $("#name"),
    $driverMenu : $("#driverMenu"),
    $driver : $('#driverDropDown'),
    $internal : $("#internal"),
    $container : $("#containerDropDown"),
    $containerMenu : $("#containerMenu"),
    $ipRange : $("#ipRange"),
    $subnet : $("#subnet"),
    $gateway : $("#gateway")
  };
  $all.form.create.formName = "네트워크 생성";
  $all.form.create.formEvent = "CreateNetwork";
  $all.form.create.$newForm =  $(".newForm");
  $all.form.create.portlists = [];
  $all.form.create.$portAdd = $(".portAdd");
  $all.form.create.$portlists = $(".portlists");
  $all.form.create.dropDown =  {
    $dropDown : $('#driverDropDown'),
    default : "driver"
  };

  $all.form.create.initDropdown = function(self){
    var self = self.data;
    var data = ["bridge", "overlay", "macvlan"];
    var $contextMenu =   self.$driverMenu;
    var $dropDown =   self.$driver;

    return initDropdownArray(data, $contextMenu, $dropDown);
  }
  $all.form.create.more = {
    $more : $("#more"),
    $less : $("#less"),
    $moreForm : $(".moreForm")
  }

  $all.connect = {};
  $all.connect.dockerinfo = "network";
  $all.table = {};
  $all.table.main = {
      "$table" : $(".jsonTable"),
      "hideColumns" : ["EnableIPv6", "Labels", "IPAM", "Containers", "Options", "Created", "Id"],
      "columns" : columns,
      "jsonUrl" : '/myapp/network/data.json',
      isExpend : false
    };

  $all.event = {};
  function clickDefault(client, eventName, table){
    return function(){
      client.sendEventTable(eventName, table);
    };
  }
  $all.event.remove = {
    $button : $("#remove"),
    eventName : "RemoveNetwork",
    clickEvent : clickDefault
  };
  $all.event.connect = {
    $button : $("#connect"),
    eventName : "ConnectNetwork",
    clickEvent : function(client, eventName, table){
      return function(){
        if($("#containerDropDown").text().trim() === "Containers") {
          return false;
        }else {
          client.sendEventTable(eventName, table);
        }
      };
    }
  };
  $all.event.disconnect = {
    $button : $("#disconnect"),
    eventName : "DisconnectNetwork",
    clickEvent : function(client, eventName, table){
      return function(){
        if($("#containerDropDown").text().trim() === "Containers") {
          return false;
        }else {
          client.sendEventTable(eventName, table);
        }
      };
    }
  };
  $all.completeEvent = function(data, callback){
    console.log(arguments);
    if(hasValue(data)){
        var dialog = require("./dialog.js");

         var finished = new dialog("네트워크", data.msg + data.statusCode, $("body"));
         finished.setDefaultButton('Close[Enker]', 'btn-primary create');
         finished.show();
         finished.close(5000);
         callback;
       }
  };

  var main = require("./main.js");
  main.init($all);
  var networkTable = main.getMainTable();
    var $detail = $("#detail");
      networkTable.clickRow($detail);

  var expandinfo = [{
     url : "/myapp/network/",
     keys : ["Containers", "Name", "Id", "Driver"]
   }];
   networkTable.expandRow(expandinfo);


});
