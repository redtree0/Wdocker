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
  const COMPLETE = {
    DO : true,
    NOT : false
  }

  $('.ip_address').mask('0ZZ.0ZZ.0ZZ.0ZZ/00', { translation: { 'Z': { pattern: /[0-9]/, optional: true } } });
  var dialog = require("./module/dialog.js");

  var $all = {};

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
      "jsonUrl" : '/myapp/network/data/' + getHostIP(),
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

  function connectionEvent(client, eventName, table){
    return function(){
      var container = $("#containerDropDown").text().trim();
      // console.log(container);
      if(container === "Containers") {
        return false;
      }else {
        var opts = {
          "checkedRowLists" : table.checkedRowLists,
          "opts" : {
            "container" : container
          }
        };  //
        // console.log(opts);
        client.sendEvent(COMPLETE.DO, eventName,  opts, ()=>{
          refresh();
        });
      }
    }
  }

  $all.event.connect = {
    $button : $("#connect"),
    eventName : "ConnectNetwork",
    clickEvent : connectionEvent
  };

  $all.event.disconnect = {
    $button : $("#disconnect"),
    eventName : "DisconnectNetwork",
    clickEvent : connectionEvent
  };
  $all.completeEvent = function(data, callback){
    // console.log(arguments);
    if(hasValue(data)){
        // var dialog = require("./module/dialog.js");
         var finished = new dialog("네트워크", data);
         finished.setDefaultButton('Close[Enker]', 'btn-primary create');
         finished.show();
         callback;
       }
  };
  $all.table.main.offLoaded = function(){
      $("#containerMenu").off();
  }
  $all.table.main.loaded = function(client, host, networkTable){

    var jsonUrl = '/myapp/container/data/' + host;
    var $contextMenu = $("#containerMenu")  ;
    var $dropDown =   $("#containerDropDown");
    var attr = "Names";
    // var index = 0;
    initDropdown(jsonUrl, $contextMenu, $dropDown, {attr : attr});
      // $("#containerMenu").off();

      $contextMenu.click((e)=>{
          networkConnectedlists();
      });


      function networkConnectedlists(){
        var item =   $dropDown.text().trim();
        if(item === "Containers"){
          return ;
        }

        return showContainerDetail((networkTable.$table), item, jsonUrl);
      }


      function showContainerDetail($table, item, jsonUrl){
        var $detail = $("#detail");
        var rows = $table.bootstrapTable('getData');

        // var jsonUrl = "/myapp/container/data/" + host;
        $.getJSON(jsonUrl, function(json, textStatus) {
          var searchNetwork = [];
          var container = json;
          var networks = null;
          var networkName = null;
          var ipAddr = null;
          container.forEach ( (data) => {
                if(item === data.Names.toString()){

                  networks = data.NetworkSettings.Networks;
                  if(Object.keys(networks).length === 0){
                        networkName = "not Exist";
                  }else if(Object.keys(networks).length === 1){
                    networkName = Object.keys(networks) ;
                    if(networks[networkName].hasOwnProperty("IPAddress")){
                      ipAddr = networks[networkName].IPAddress;
                    }
                  }else {
                    networkName = Object.keys(networks) ;
                  }


                  if(ipAddr === null || ipAddr === "" ) {
                      ipAddr = "not Exist or not Running";
                  }
                  // console.log(networks[networkName].IPAMConfig);
                  var msg = "Container : " + data.Names
                    + "<br/>Image : " + data.Image
                    + "<br/>Network : " + networkName
                    + "<br/>State : " + data.State
                    + "<br/>IP Address : " + ipAddr;
                  $detail.html(msg);

                }

          } );



        });
      }
  };

  var main = require("./module/main.js");
  main.init($all);
  var networkTable = main.getMainTable();

});
