

$(function  () {


  var hosts = [];
  var swarmToken = {};
  var leaderPort = null;
  var isSwarm = false;

    $("#leader").addClass("simple_with_animation");

    $.getJSON("/myapp/settings/data.json", function(json, textStatus){
      // console.log(json);
      json.forEach((data)=>{
        var node = data.ip + ":" + data.port;
        hosts.push({ "ip" : data.ip , "port" : data.port });
        var $li = $("<li/>").attr({
          class : "highlight",
          "data-id" : data.ip ,
          "ip" : data.ip ,
          "data-name" : data.port,
          "port" : data.port
        }).text(node);
        $("#initlists").append($li);

      })
    });


    var adjustment;

   var group =  $("ol.simple_with_animation").sortable({
      group: 'simple_with_animation',
      pullPlaceholder: false,
      delay: 500,

      // animation on drop
      isValidTarget: function  ($item, container) {
        // console.log("isValidTarget");
        var id = $item.attr("data-id");
        // console.log($(container.el).attr("id"));
        // console.log($("#managers").attr("id"));
        // console.log($("#workers").attr("id"));
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
        if($item.is(".highlight"))
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
        // console.log("onDrop");

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

    var socket = io();
    var Socket = require("./module/io");
    var client = new Socket(socket, $('body'));
    function nodeDataMapping(search){
      var data = group.sortable("serialize").get();
      data.splice(0,1);
      // console.log(data);
      for(var i in data){
        var type = (data[i]);
        console.log(type);
        for(var j in type){
          type[j].ip = type[j].id; // ip
          type[j].nodeID = type[j].name;
          // type[j].version = type[j].version;
          delete type[j].id;
          for(var k in hosts){
            // console.log(search);
            // console.log(type[j].ip);
            if(hosts[k].ip === type[j].ip){
              type[j].port = hosts[k].port;
            }
            if (search === type[j].ip){
             return type[j];
            }
            // else if (search === type[j].ip){
            //   hosts[k].nodeID = type[j].name;
            //   return hosts[k];
            // }
          }

        }
      }
      console.log(data);
      return data;
    }

    function getLeader(){
      var host = $("#leader").find("li").text().split(":");
      var opts = {};
      opts.host = host[0];
      opts.port = host[1];
      return opts;
    }

    $(document).on('click','.delete',function(){
      var host = $(this).parent().text();
      console.log(host);
      var data = nodeDataMapping(host);
      console.log("delete");
      console.log(data);
      $(this).parent().remove();
      var leader = getLeader();
      console.log("leader");
      var opts = {
        "leader" : leader,
        "remove" : data
      }
      console.log(opts);
      client.sendEvent("ThrowNode", data, (data)=>{
        console.log("ThrowNode");
        console.log(data);
        client.sendEvent("RemoveNode", opts, (data)=>{
          console.log("RemoveNode");
          var dialog = require("./module/dialog.js");

          var finished = new dialog("Swarm & Node", data);
          finished.setDefaultButton('Close[Enker]', 'btn-primary create');
          finished.show();
          console.log(data);
        });

      });

    });

    $(".update").click(function(){


        function getElementJson($lists){
          var lists = [];
          $lists.each(function(){
            var ip = $(this).attr("ip");
            var port = $(this).attr("port");
            console.log(ip);
            console.log(port);
            if(!$(this).hasClass("loaded")){
              lists.push({"ip" : ip , "port" : port});
            }
          });
          return lists;
        }

        // console.log(data);
        var opts = {
          "leader" : getElementJson($("#leader li")),
          "managers" : getElementJson($("#managers li")),
          "workers" : getElementJson($("#workers li")),
          "managerToken" : swarmToken.manager,
          "workerToken" : swarmToken.worker,
          "swarmPort" : leaderPort
        }

        console.log(opts);
        client.sendEvent("UpdateSwarm", opts, (data)=>{
          var dialog = require("./module/dialog.js");

          var finished = new dialog("Swarm & Node", data);
          finished.setDefaultButton('Close[Enker]', 'btn-primary create');
          finished.show();
          refresh();
          // console.log(data);
        });
        // console.log(hosts);
    });

    var $all = {};
    $all.event = {};
    function clickDefault(client, eventName, table){
      return function(){
        client.sendEventTable(eventName, table);
      };
    }
    var config = require("./module/config");

    $all.event.init = {
        $button : $(".init"),
        eventName : "InitSwarm",
        clickEvent : function(client, eventName, table){
          return function(){
            var $swarmPort = $("#swarmPort");
            var data = group.sortable("serialize").get();

            var host = $("#leader").find("li").text().split(":");
            config.setSwarmInit({"ip" : host[0], "port" : $swarmPort.val()});
            var opts = config.getSwarmInit();

            opts.host = host[0];
            opts.port = host[1];

            client.sendEvent(eventName , opts, ()=>{
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
            // var host = $("#leader").find("li").text().split(":");
            // var opts = {};
            // opts.host = host[0];
            // opts.port = host[1];
            var leader = getLeader();
            client.onlySendEvent(eventName , leader, (data)=>{
              console.log("loadSwarm");
              console.log(data.msg.JoinTokens);
              swarmToken.manager = data.msg.JoinTokens.Manager;
              swarmToken.worker = data.msg.JoinTokens.Worker;

              // setTimeout(()=>{location.reload(true)}, 3000);
            });
            client.sendEvent("LoadNode" , leader, (data)=>{
              console.log(data.msg);
              var data = data.msg;
              $("#managers").children().remove();
              $("#workers").children().remove();
              for(var i in data){
                // console.log(data[i]);
                var role = data[i].Spec.Role;
                var nodeID = data[i].ID;
                var hostname = data[i].Description.Hostname;
                var hostIP = data[i].Status.Addr;
                var State = data[i].Status.State;
                var version = data[i].Version.Index;

                // $("#index" + rowIndex)
                var isLeader = false;
                if(data[i].hasOwnProperty("ManagerStatus") && data[i].ManagerStatus.hasOwnProperty("Leader")){
                  isLeader =  data[i].ManagerStatus.Leader;
                  leaderPort = data[i].ManagerStatus.Addr.split(":")[1];
                }else {
                  isLeader = false;
                }
                $("#leader").removeClass("simple_with_animation");
                // console.log(isLeader);
                var node = null;
                var remove = "<span class='glyphicon glyphicon-remove delete'></span>"
                // console.log(hostIP);
                // console.log(isLeader);
                node = hostIP  + remove;
                var $li = $("<li/>").attr({
                  class : "highlight loaded",
                  "data-id" : hostIP ,
                  "ip" : hostIP ,
                  "data-name" : nodeID,
                  "nodeID" : nodeID,
                  "version" : version
                }).html(node);

                if(isLeader && role === "manager" ){
                }
                else if(role === "manager" ){
                  $("#managers").append($li);
                }else if(role === "worker"){
                  $("#workers").append($li);
                }
              }
              // setTimeout(()=>{location.reload(true)}, 3000);
            });
            }
        }
    };

    $all.event.leave = {
        $button : $(".leave"),
        eventName : "LeaveSwarm",
        clickEvent : function(client, eventName, table){
          return function(){
            client.sendEvent(eventName , true, ()=>{
              setTimeout(()=>{location.reload(true)}, 3000);
            });
            }
        }
    };

    $all.completeEvent = function(data, callback){
      // console.log(arguments);
      if(hasValue(data)){
        var dialog = require("./module/dialog.js");

        var finished = new dialog("Swarm & Node", data);
        finished.setDefaultButton('Close[Enker]', 'btn-primary create');
        finished.show();
        callback;
      }
    };

    var main = require("./module/main.js");
    main.init($all);

    // $(".delete").click((e)=>{
    // });
});
