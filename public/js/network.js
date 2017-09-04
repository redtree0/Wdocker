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
  }, {
      field: 'Labels',
      title: '라벨',
      formatter : function (value , row, index){
        return JSON.stringify(value);
      }
  }];





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
  $all.form.create.$portAdd = $("#portAdd");
  $all.form.create.$portlists = $("#portlists");
  $all.form.create.labellists = [];
  $all.form.create.$labelAdd = $("#labelAdd");
  $all.form.create.$labellists = $("#labellists");
  // $all.form.create.dropDown =  {
  //   $dropDown : $('#driverDropDown'),
  //   default : "driver"
  // };

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
          var opts ={
            "container" : $("#containerDropDown").text().trim()
          }
          client.sendEventTable(eventName, table, opts);
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
          var opts ={
            "container" : $("#containerDropDown").text().trim()
          }
          client.sendEventTable(eventName, table, opts);
        }
      };
    }
  };
  $all.completeEvent = function(data, callback){
    // console.log(arguments);
    if(hasValue(data)){
        var dialog = require("./module/dialog.js");
         var finished = new dialog("네트워크", data);
         finished.setDefaultButton('Close[Enker]', 'btn-primary create');
         finished.show();
         callback;
       }
  };

  var main = require("./module/main.js");
  main.init($all);
  var networkTable = main.getMainTable();
      // networkTable.clickRow($detail);

  var expandinfo = [{
     url : "/myapp/network/",
     keys : ["Containers", "Name", "Id", "Driver"]
   }];
   networkTable.expandRow(expandinfo);

  var $detail = $("#detail");
  $("#containerMenu").click((e)=>{
      networkConnectedlists();
  });

  networkTable.$table.on("page-change.bs.table", function(e, number, size){
      networkConnectedlists()
  })

  function networkConnectedlists(){
    var item =   $("#containerDropDown").text().trim();
    if(item === "Containers"){
      return ;
    }

    return showDetailAddColor((networkTable.$table), item, "danger");
  }


  function showDetailAddColor($table, item, _class){
    var rows = $table.bootstrapTable('getData');

    $.getJSON("/myapp/container/data.json", function(json, textStatus) {
      var searchNetwork = [];
      var container = json;
      container.forEach ( (data) => {
            if(item === data.Names.toString()){
              // $detail.append(JSON.stringify(data));
              var networkmsg = null;
              console.log(Object.keys(data.NetworkSettings.Networks));
              if(Object.keys(data.NetworkSettings.Networks).length === 0){
                    networkmsg = "not Exist";
              }else {
                networkmsg = Object.keys(data.NetworkSettings.Networks) ;
              }
              var msg = "Container : " + data.Names
                + "<br/>Image : " + data.Image
                + "<br/>Network : " + networkmsg;
              $detail.html(msg);

            }
            var networkSettings = data.NetworkSettings.Networks;
            for(var network in networkSettings){
                searchNetwork.push({"name" : data.Names, "networkId" : networkSettings[network].NetworkID});
              }

      } );
      // console.log(searchNetwork);
      $table.find("tr").removeClass(_class);
      rows.forEach((data)=>{
        for(var network in searchNetwork){
          if(item == searchNetwork[network].name ){
            if (data.Id == searchNetwork[network].networkId) {
              // for(var i in $table.find("td:nth-child(2)"))
              $table.find('td:nth-child(2)').filter(function() {
                  return $(this).text() === data.Name ;
              }).parent().addClass(_class);

              // $table.find("td:contains("+ data.Id + ")").parent().addClass(_class);
            }
          }
        }
      });


    });
  }
});
