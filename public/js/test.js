

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
          "data-name" : data.port
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

        if($(container.el).attr("id") === $("#managers").attr("id")){
          if($("#workers").find("li:contains("+ id +")").length >= 1){
            return  $item.parent("ol")[0] == container.el[0];
          }
        }else if ($(container.el).attr("id") === $("#workers").attr("id")) {
          if($("#managers").find("li:contains("+ id +")").length >= 1){
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

        // console.log($item);
        // var remove = "<span class='glyphicon glyphicon-remove delete'></span>"
        // var $item = $item.append(remove);
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
        // console.log($item);
        // console.log(container);
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

      // afterMove: function ($placeholder, container, $closestItemOrContainer) {
      //   console.log($("#leader").find("li").length);
      //   if($("#leader").find("li").length >= 1){
      //
      //   }
      // },
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
        for(var j in type){
          type[j].ip = type[j].id;
          type[j].nodeID = type[j].name;
          delete type[j].id;
          for(var k in hosts){
            if(hosts[k].ip === type[j].ip){
              type[j].port = hosts[k].port;
            }
            else if (search === type[j].ip){
              hosts[k].nodeID = type[j].name;
              return hosts[k];
            }
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

      var data = nodeDataMapping(host);
      console.log("getData");
      console.log(data);
      $(this).parent().remove();
      var leader = getLeader();
      console.log("leader");
      var opts = {
        "leader" : leader,
        "remove" : data
      }
      console.log(opts);
      client.sendEvent("RemoveNode", opts);
      // client.sendEvent("ThrowNode", data);

    });

    $(".update").click(function(){
        console.log("click");
        // console.log(group.sortable("serialize").get());

        console.log(data);
        var data = nodeDataMapping();


        console.log(data);
        var opts = {
          "leader" : data[0],
          "managers" : data[1],
          "workers" : data[2],
          "managerToken" : swarmToken.manager,
          "workerToken" : swarmToken.worker,
          "swarmPort" : leaderPort
        }

        client.sendEvent("CreateSwarm", opts);
        // console.log(data);
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

            config.setSwarmInit({port : $swarmPort.val()});
            var opts = config.getSwarmInit();
            // console.log(opts);

            // console.log($("#leader li").attr("data-id"));
            // console.log($("#leader").find("li").attr("data-id"));
            var host = $("#leader").find("li").text().split(":");
            console.log(host);
            opts.host = host[0];
            opts.port = host[1];
            console.log(host);

            console.log(opts);
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
                // console.log(hostIP);
                // console.log(isLeader);


                var remove = "<span class='glyphicon glyphicon-remove delete'></span>"
                if(isLeader && role === "manager" ){
                }
                else if(role === "manager" ){
                  node = hostIP  + remove;
                  var $li = $("<li/>").attr({
                    class : "highlight",
                    "data-id" : hostIP ,
                    "data-name" : nodeID
                  }).html(node);
                  $("#managers").append($li);
                }else if(role === "worker"){
                  node = hostIP  + remove;
                  var $li = $("<li/>").attr({
                    class : "highlight",
                    "data-id" : hostIP ,
                    "data-name" : nodeID
                  }).html(node);
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
