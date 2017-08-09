
"use strict";

var main = (function(){
    var settings = {};
    var socket = io();
    var Socket = require("./io");
    var client = new Socket(socket, $('body'));
    var spin = require("./spinner");
    var table = require("./table.js");
    var dialog = require("./dialog.js");



    return {
        init: function($all,  callback) {
            var self = this;
            settings = $all;

            settings.$body = $("body");
            settings.client = client;
            if(settings.hasOwnProperty("table")){

              settings.mainTable = new table(settings.table.main.$table, settings.table.main.columns);
              if(settings.table.hasOwnProperty("sub")){
                settings.subTable = new table(settings.table.sub.$table, settings.table.sub.columns);
                console.log(settings.subTable);
              }
            }

            client.completeEvent = settings.completeEvent;



            settings.clickDropdown = function ($dropdown, defaultVal) {
                  if( ($dropdown.text()).trim() === defaultVal ){
                    return false;
                  }
                  return true;
                };
            settings.checkValue = function (json) {
                      for(var i in json){
                          if(json[i] === null || json[i] === undefined || json[i] === ""){
                              return false;
                        }
                  }
                return true;
            };


            if(settings.hasOwnProperty("init")){
              settings.init();
            }
            if(settings.hasOwnProperty("table")){
              self.tableInit();
            }
            if(settings.hasOwnProperty("form")){
              self.hideForm();
              self.showForm();
              if(settings.form.create.hasOwnProperty("$portlists")){
                self.addPort();
                self.deletePort();
              }
              if(settings.hasOwnProperty("event")){
                self.socketButtonEvent();
              }
            }
            if(settings.hasOwnProperty("connect")){
              settings.connect.$connectMenu = $("#connectMenu");
              settings.connect.$connectDropDown = $("#connectDropDown");
              settings.connect.$whoisConnected = $(".whoisConnected");
              settings.connect.$connectButton = $(".connectButton");

              self.connectDocker();
            }
            if(settings.form.hasOwnProperty("update")){
                  self.updateFrom();
            }

            // self.buttonEvent();
        },
        getMainTable : function(){
          return settings.mainTable;
        },
        getSubTable : function(){
          return settings.subTable;
        },
        getSocket : function(){
          return client;
        },
        getDialog : function (){
          return dialog;
        },
        updateFrom : function (){
          var self = settings.form.update;

          var clone = settings.form.$form.clone().attr("id", "updateForm");

          function setNewId(i, element ){
            var originId = $(element).attr("id");
            $(element).attr("id", originId + "New");
          }
          var input = clone.find("input");
          var button = (clone.find("button"));
          var div = (clone.find("div"));
          input.each(setNewId);
          button.each(setNewId);
          div.each(setNewId);

          clone.append($("<button/>").addClass("btn btn-primary").attr("id", "update").text("Update"));
          self.$form.append(clone);
          // clone.show();
          // function setSettings (json, portArray){
          //     var config = require("./config");
          //
          //     config[self.settingMethod.set](json, portArray);
          //     return  config[self.settingMethod.get]();
          // }
          // var opts = setSettings(self.getSettingValue(self), self.portlists);
          settings.mainTable.$table.on('click-row.bs.table', function (r, e, f){

            // var portlists = [];
            clone.show();
            // $detail.children().show();
            var data = e;

            $("#serviceNameNew").val(data.Spec.Name);
            $("#commandNew").val(data.Spec.TaskTemplate.ContainerSpec.Command);
            $("#replicasNew").val(data.Spec.Mode.Replicated.Replicas);

            var portlistsNew = data.Spec.EndpointSpec.Ports.filter((val)=>{   delete val.PublishMode;  return val; });

            $.getJSON("/myapp/network/" + data.Spec.TaskTemplate.Networks["0"].Target, function(data){
                initDropdown("/myapp/network/data.json", $("#networkMenu"),  $("#networkDropDownNew"),
                {"attr" : "Name", "selected" : data.Name});
            });
            initDropdown("/myapp/image/data.json", $("#imageMenu"), $("#imageDropDownNew") ,
                {"attr" :  "RepoTags", "index" :  0, "selected" :  data.Spec.TaskTemplate.ContainerSpec.Image.split("@")[0]});
            var $portlistsNew = $("#portlistsNew");
            createList($portlistsNew, portlistsNew);
            clickDeleteList($portlistsNew, portlistsNew);

            $("#portAddNew").click((e)=>{
              e.preventDefault();
              var $protocol =  $("#protocolNew");
              var $containerPort = $("#containerPortNew");
              var $hostPort = $("#hostPortNew");

              var $array = [$containerPort, $hostPort, $protocol];
              var state = true;
              for (var i in $array) {
                if(!(hasValue($array[i].val()))){
                  state = false;
                }
              }
              if(state) {
                // console.log(portlists);
                insertArray(portlistsNew, $array);
                createList ( $portlistsNew, portlistsNew );
              }
            });

          });
          // return dialog;
        },
        tableInit: function(){

          var self = settings.table.main;
          var mainTable =  settings.mainTable;
          console.log("do");
          mainTable.initUrlTable(self.jsonUrl, true);
          mainTable.hideColumns(self.hideColumns);
          mainTable.checkAllEvents();
          mainTable.clickRowAddColor("danger");

          if(settings.table.hasOwnProperty("sub")){
            var self = settings.table.sub;
            var subTable =  settings.subTable;
            console.log("sub");
            subTable.initDataTable({});
            subTable.checkAllEvents();
          }

        }
        ,
        hideForm : function(){
          settings.form.$form.hide();
        },
        showForm : function(){
          var self = settings.form.create;
          self.$newForm.click((e)=>{
            e.preventDefault();

            var popup = new dialog(self.formName, self.$form.show(), settings.$body);

            if(self.hasOwnProperty("initDropdown")){
              self.initDropdown();
            }

            popup.appendButton('Create', 'btn-primary create',
            function(dialogItself){

              function setSettings (json, portArray){
                var config = require("./config");

                config[settings.form.settingMethod.set](json, portArray);
                return  config[settings.form.settingMethod.get]();
              }
              // console.log(self.getSettingValue());
              var opts = setSettings(settings.form.getSettingValue(self), self.portlists);

              if(settings.checkValue(opts)){
                if( self.hasOwnProperty("completeEvent") ){
                  client.completeEvent = self.completeEvent;
                }
                if( self.hasOwnProperty("dropDown") ){
                  settings.clickDropdown(self.dropDown.$dropDown, self.dropDown.default);
                }
                if( self.hasOwnProperty("callback") ){
                  client.sendEventTable(self.formEvent, settings.mainTable, opts, self.callback);
                }else {
                  client.sendEventTable(self.formEvent, settings.mainTable, opts);
                }
              }else {
                console.log("more value");
              }

            });
            //
            popup.show();
            //
          });
        }
        ,
        connectDocker : function(){
          var self = settings.connect;
          var jsonUrl = '/myapp/settings/data.json';
          var jsonAttr = "ip";
          initDropdown(jsonUrl, self.$connectMenu, self.$connectDropDown, {attr : jsonAttr});

         client.sendEvent("GetThisDocker", {"docker" : self.dockerinfo}, (data)=>{
              self.$whoisConnected.text(data);
         });

        self.$connectButton.click((e)=>{
            //  e.preventDefault();
            console.log("clicked");
             var ip = self.$connectDropDown.text().trim();
             if(ip === "Connect Docker"){
                 return false;
             }
               self.$whoisConnected.text(ip);
               var data = {
                 "ip" : ip,
                 "docker" : self.dockerinfo
               }
               if(settings.hasOwnProperty("mainTable")){

                 client.sendEventTable("ConnectDocker", settings.mainTable, data);

               }else {
                 client.sendEvent("ConnectDocker",  data, (data)=>{console.log(data);});
               }
         });
        }
        , addPort : function(){
          var self = settings.form.create;
          console.log("init");
          self.$portAdd.click((e)=>{
              e.preventDefault();
              console.log("clicke");
              var $protocol = $("#protocol");
              var $containerPort = $("#containerPort");
              var $hostPort = $("#hostPort");

              var $array = [$containerPort, $hostPort, $protocol];
              var state = true;
              for (var i in $array) {
                if(!(hasValue($array[i].val()))){
                  state = false;
                }
              }
              if(state) {
                insertArray(self.portlists, $array);
                createList ( self.$portlists, self.portlists );
              }
          });
        }, deletePort : function(){
          var self = settings.form.create;
          self.$portlists.on('click', 'button', function(e){
          e.preventDefault();

          var id = "#row" + $(this).attr("id");
              if($(this).hasClass("delete")) {
                $(id).fadeOut("slow");

                self.portlists.splice($(this).attr("id"), 1);

                createList ( self.$portlists, self.portlists);
              }
        });

        }, socketButtonEvent : function (){
          var self = settings;


          for (var i in self.event) {
            console.log(self.event[i]);
            self.event[i].$button.click(
                // clickCallback(self.event[i].eventName, self.mainTable)
              self.event[i].clickEvent(client, self.event[i].eventName, self.mainTable)
              // client.sendEventTable(self.event[i].eventName, self.mainTable);
            );
          }
        }


    }

})();

module.exports = main;
// $(document).ready(function() {
//     TestWidget.init();
// });
