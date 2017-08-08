
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
            settings.mainTable = new table(settings.table.$jsonTable, settings.table.columns);

            client.completeEvent = settings.completeEvent;

            settings.connect.$connectMenu = $("#connectMenu");
            settings.connect.$connectDropDown = $("#connectDropDown");
            settings.connect.$whoisConnected = $(".whoisConnected");
            settings.connect.$connectButton = $(".connectButton");

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



            settings.init();
            self.tableInit();
            self.hideForm();
            self.showForm();
            self.addPort();
            self.deletePort();

            self.connectDocker();
            self.socketButtonEvent();

            // self.buttonEvent();
        },
        getMainTable : function(){
          return settings.mainTable;
        },
        getSocket : function(){
          return client;
        },
        getDialog : function (){
          return dialog;
        }
        tableInit: function(){

          var self = settings.table;
          var table =  settings.mainTable;
          table.initUrlTable(self.jsonUrl, true);
          table.hideColumns(self.hideColumns);
          table.checkAllEvents();
          table.clickRowAddColor("danger");

        }
        ,
        hideForm : function(){
          settings.form.$form.hide();
        },
        connectDocker : function(){
          var self = settings.connect;
          var jsonUrl = '/myapp/settings/data.json';
          var jsonAttr = "ip";
          initDropdown(jsonUrl, self.$connectMenu, self.$connectDropDown, jsonAttr);

         client.sendEvent("GetThisDocker", {"docker" : self.dockerinfo}, (data)=>{
              self.$whoisConnected.text(data);
         });

        self.$connectButton.click((e)=>{
            //  e.preventDefault();
             var ip = self.$connectDropDown.text().trim();
             if(ip === "Connect Docker"){
                 return false;
             }
               self.$whoisConnected.text(ip);
               var data = {
                 "ip" : ip,
                 "docker" : self.dockerinfo
               }
             client.sendEventTable("ConnectDocker", settings.mainTable, data);
         });
        }
        ,
        showForm : function(){
          var self = settings.form;
            self.$newForm.click((e)=>{
              e.preventDefault();

              var popup = new dialog(self.formName, self.$form.show(), settings.$body);
              self.initDropdown();
              // initDropdown('/myapp/image/data.json', self.$imageMenu, self.$image, "RepoTags", 0);
              popup.appendButton('Create', 'btn-primary create',
                          function(dialogItself){


                            function setSettings (json, portArray){
                              var config = require("./config");

                              config[self.settingMethod.set](json, portArray);
                              return  config[self.settingMethod.get]();
                            }

                              var opts = setSettings(self.getSettingValue(), self.portlists);

                              if(settings.checkValue(opts) &&  settings.clickDropdown(self.dropDown.$dropDown, self.dropDown.default)){
                                client.sendEventTable(self.formEvent, settings.mainTable, opts);
                              }else {
                                console.log("more value");
                              }
                          });
          //
              popup.show();
          //
            });
        }, addPort : function(){
          var self = settings.form;
          self.$portAdd.click((e)=>{
              e.preventDefault();
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
          var self = settings.form;
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

          function clickCallback (eventName, table, hasDropdown){
              return function(){

                client.sendEventTable(eventName, table);
                // self.client.sendEventTable(eventName, table);
              };
          }
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
