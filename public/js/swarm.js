
'use strict';

$(function  () {


  var hosts = [];
  var swarmToken = {};
  var leaderPort = null;
  var isSwarm = false;
  const COMPLETE = {
    DO : true,
    NOT : false
  }
  function loadSwarm(client){
    $("#init").hide();
    $(".load").hide();
    $(".update").show();
    $("#leave").show();
    $("#reload").show();


    var leader = getLeader();
    client.sendEvent(COMPLETE.DO, "LoadSwarm" , leader, (data)=>{



      if(data.hasOwnProperty("state") && (data.state === false)){
        refresh();
        return;
      }

      swarmToken.manager = data.msg.JoinTokens.Manager;
      swarmToken.worker = data.msg.JoinTokens.Worker;
      // setTimeout(()=>{location.reload(true)}, 3000);
      client.sendEvent(COMPLETE.NOT, "LoadNode" , leader, (data)=>{
        // console.log(data.msg);
        var data = data.msg;
        $("#managers").children().remove();
        $("#workers").children().remove();
        $("#leader").removeClass("sortable");

        var leaderNode = $("#leader").find("li");
        leaderNode.removeClass("isLoaded");
        leaderNode.addClass("isLeader");
        for(var i in data){
            // console.log(data[i]);
            var role = data[i].Spec.Role;
            var nodeID = data[i].ID;
            var hostname = data[i].Description.Hostname;
            var hostIP = data[i].Status.Addr;
            var state = data[i].Status.State;
            var version = data[i].Version.Index;
            var availability = data[i].Spec.Availability;
            // $("#index" + rowIndex)
            var isLeader = false;
            if(data[i].hasOwnProperty("ManagerStatus") && data[i].ManagerStatus.hasOwnProperty("Leader")){
              isLeader =  data[i].ManagerStatus.Leader;
              leaderPort = data[i].ManagerStatus.Addr.split(":")[1];
            }else {
              isLeader = false;
            }


            // console.log(isLeader);
            var node = null;
            var remove = "<span class='glyphicon glyphicon-remove delete'></span>"
            // console.log(hostIP);
            // console.log(isLeader);
            node = hostIP  + remove;
            var port = null;
            for(var i in hosts){
              if(hosts[i].ip === hostIP){
                port = hosts[i].port;
              }
            }
            var $li = $("<li/>").attr({
              // class : "isLoaded loaded",
              "class" : "isNode",
              "ip" : hostIP ,
              "port" : port,
              "nodeID" : nodeID,
              "version" : version,
              "availability" : availability
            }).html(node);

            if(state === "down"){
              $li.addClass("isDown");
            }
            if(isLeader && role === "manager" ){
            }
            else if(role === "manager" ){
              $li.addClass("isManager");
              $("#managers").append($li);
            }else if(role === "worker"){
              $li.addClass("isWorker");
              $("#workers").append($li);
            }
        }
        // setTimeout(()=>{location.reload(true)}, 3000);
      });
    });
  }


    $("#leader").addClass("sortable");
    $(".update").hide();
    $("#leave").hide();
    $("#reload").hide();

    // console.log(hosts);


    initDragable();
    initDragableNode(hosts);
    function initDragableNode(hosts){
          $("#initlists").children().remove();

          $.getJSON("/myapp/settings/data.json", function(json, textStatus){
            // console.log(json);
            json.forEach((data)=>{
              var node = data.ip ;
              hosts.push({ "ip" : data.ip , "port" : data.port });
              var $li = $("<li/>").attr({
                class : "isLoaded",
                "data-id" : data.ip ,
                "ip" : data.ip ,
                "data-name" : data.port,
                "port" : data.port
              }).text(node);
              $("#initlists").append($li);

            });
        });
    }

    function initDragable(){
      var adjustment;

      var group =  $("ol.sortable").sortable({
        group: 'sortable',
        pullPlaceholder: false,
        delay: 500,

        // animation on drop
        isValidTarget: function  ($item, container) {

          var id = $item.attr("data-id");

          if($(container.el).attr("id") === $("#managers").attr("id")){
            if($("#managers").find("li:contains("+ id +")").length >= 1){
              return  $item.parent("ol")[0] == container.el[0];
            }
          }else if ($(container.el).attr("id") === $("#workers").attr("id")) {
            if($("#workers").find("li:contains("+ id +")").length >= 1){
              return  $item.parent("ol")[0] == container.el[0];
            }
          }
          if($(container.target).attr('id')=== "leader" && $(container.target).children().length >= 1){
            return  $item.parent("ol")[0] == container.el[0];
          } else
          if($item.is(".isLoaded"))
          return true;
          else  if($item.is(".placeholder")){
            return  $item.parent("ol")[0] == container.el[0];
          }
          else
              return $item.parent("ol")[0] == container.el[0];
        },
        onDrop: function  ($item, container, _super) {
          var $clonedItem = $('<li/>').css({height: 0});
          $item.before($clonedItem);

          $clonedItem.animate({'height': $item.height()});
          // if($("#leader").find("li").length)
          var data = group.sortable("serialize").get();
          // console.log(data);
          var jsonString = JSON.stringify(data, null, ' ');
          // console.log(jsonString);
          $item.animate($clonedItem.position(), function  () {
              $clonedItem.detach();
              _super($item, container);
          });
        },

        // set $item relative to cursor position
        onDragStart: function ($item, container, _super) {
          var offset = $item.offset(),
          pointer = container.rootGroup.pointer;
          // console.log("onDragStart");

          adjustment = {
            left: pointer.left - offset.left,
            top: pointer.top - offset.top
          };

          _super($item, container);
        },
        onDrag: function ($item, position) {
          // console.log("onDrag");

          $item.css({
            left: position.left - adjustment.left,
            top: position.top - adjustment.top
          });
        },

        onMousedown: function ($item, _super, event) {
          if (!event.target.nodeName.match(/^(input|select|textarea)$/i)) {
            event.preventDefault()
            return true
          }
        }
      });

    }

    // var socket = io();
    // var Socket = require("./module/io");
    // var client = new Socket(socket, $('body'));
    // var main = require("./module/main");
    var dialog = require("./module/dialog.js");
    var config = require("./module/config");

    function getLeader(){
        var host = $("#leader").find("li");
        var opts = {};
        opts.host = host.attr("ip");
        opts.port = host.attr("port");
        return opts;
    }


    var $all = {};
    $all.event = {};
    function clickDefault(client, eventName, table){
        return function(){
          client.sendEventTable(eventName, table);
        };
    }



    $all.event.init = {
        $button : $(".init"),
        eventName : "InitSwarm",
        clickEvent : function(client, eventName, table){
          return function(){
            var $swarmPort = $("#swarmPort");

            var host = $("#leader").find("li");
            /// swarm init  info
            config.setSwarmInit({"ip" : host.attr("ip"), "port" : $swarmPort.val()});
            var opts = config.getSwarmInit();
            /// remote docker connection info
            opts.host = host.attr("ip");
            opts.port =  host.attr("port");
            // console.log(opts)
            client.sendEvent(COMPLETE.DO, eventName , opts, ()=>{
              refresh();
            });

          }
        }
    };

    $all.event.load = {
        $button : $(".load"),
        eventName : "LoadSwarm",
        clickEvent : function(client, eventName, table){
          return function(){
                loadSwarm(client);
            }
        }
    };

    $all.event.reload = {
        $button : $("#reload"),
        eventName : "LoadSwarm",
        clickEvent : function(client, eventName, table){
          return function(){
                loadSwarm(client);
            }
        }
    };

    $all.event.leave = {
        $button : $(".leave"),
        eventName : "LeaveSwarm",
        clickEvent : function(client, eventName, table){
          return function(){
            const FORCE = (!$("#force").prop("checked"));
              client.sendEvent(COMPLETE.DO, eventName , FORCE, ()=>{
                refresh();
              });
            }
        }
    };

    $all.event.update = {
          $button : $(".update"),
          eventName : "UpdateSwarm",
          clickEvent : function(client, eventName, table){
            return function(){

                function getElementJson($lists){
                  var lists = [];
                  $lists.each(function(){
                      var ip = $(this).attr("ip");
                      var port = $(this).attr("port");

                      if(!$(this).hasClass("isNode")){
                        lists.push({"ip" : ip , "port" : port});
                      }
                  });
                  // console.log(lists);
                  return lists;
                }

                var opts = {
                  "leader" :  getElementJson($("#leader li")),
                  "managers" : getElementJson($("#managers li")),
                  "workers" : getElementJson($("#workers li")),
                  "managerToken" : swarmToken.manager,
                  "workerToken" : swarmToken.worker,
                  "swarmPort" : leaderPort
                }
                // console.log(opts);

                client.sendEvent(COMPLETE.DO, "UpdateSwarm", opts, ()=>{
                    refresh();
                });
              }
          }
      };

      // $all.event.delete = {
      //       $button : $(".delete"),
      //       eventName : "RemoveNode",
      //       clickEvent : function(client, eventName, table){
      //         return function(){
      //                   var node = $(this).parent();
      //                   var nodeType = (node.closest('ol').attr("id"));
      //                   var opts = {
      //                     "host" : node.attr("ip"),
      //                     "port" : node.attr("port"),
      //                     "nodeID" : node.attr("nodeID"),
      //                     "Version" : node.attr("version"),
      //                     "Availability" : node.attr("availability")
      //                   }
      //                   console.log(opts);
      //                   node.remove();
      //                   var leader = getLeader();
      //                   var removeOpts = {
      //                     "leader" : leader,
      //                     "remove" : opts
      //                   }
      //
      //                   // console.log($(this));
      //
      //                   client.sendEvent(COMPLETE.NOT, "RemoveNode", removeOpts, (data)=>{
      //
      //                        client.sendEvent(COMPLETE.NOT, "ThrowNode", opts, (data)=>{
      //                           console.log("callbacked");
      //                            var finished = new dialog("Swarm & Node", data);
      //                            finished.setDefaultButton('Close[Enker]', 'btn-primary create');
      //                            finished.show();
      //                        });
      //
      //                    });
      //             }
      //         }
      //     }



    $all.completeEvent = function(data, callback){
      // console.log(arguments);
      if(hasValue(data)){
        var finished = new dialog("Swarm & Node", data);
        finished.setDefaultButton('Close[Enker]', 'btn-primary create');
        finished.show();
        callback;
      }
    };

    var main = require("./module/main.js");
    main.init($all);
    var client = main.getSocket();



    $(document).on('click','.delete', function(){

        var node = $(this).parent();
        var nodeType = (node.closest('ol').attr("id"));
        var opts = {
          "host" : node.attr("ip"),
          "port" : node.attr("port"),
          "nodeID" : node.attr("nodeID"),
          "Version" : node.attr("version"),
          "Availability" : node.attr("availability")
        }

        node.remove();
        var leader = getLeader();
        var removeOpts = {
          "leader" : leader,
          "remove" : opts
        }

        client.sendEvent(COMPLETE.NOT, "RemoveNode", removeOpts, (data)=>{

             client.sendEvent(COMPLETE.NOT, "ThrowNode", opts, (data)=>{
                //  console.log(data);
                //  console.log(nodeType);
                 var finished = new dialog("Swarm & Node", data);
                 finished.setDefaultButton('Close[Enker]', 'btn-primary create');
                 finished.show();
             });

       });

    });

});
