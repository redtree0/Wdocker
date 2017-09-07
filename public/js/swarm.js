

$(function  () {


  var hosts = [];
  var swarmToken = {};
  var leaderPort = null;
  var isSwarm = false;

    $("#leader").addClass("simple_with_animation");
    $(".update").hide();
    $("#leave").hide();

    $.getJSON("/myapp/settings/data.json", function(json, textStatus){
      // console.log(json);
      json.forEach((data)=>{
        var node = data.ip ;
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

    function getLeader(){
      var host = $("#leader").find("li").text().split(":");
      var opts = {};
      opts.host = host[0];
      opts.port = host[1];
      return opts;
    }
     var dialog = require("./module/dialog.js");
    $(document).on('click','.delete',function(){

      console.log("delete");
      var node = $(this).parent();
      var nodeType = (node.closest('ol').attr("id"));
      var opts = {
        "host" : node.attr("ip"),
        "port" : node.attr("port"),
        "nodeID" : node.attr("nodeID"),
        "Version" : node.attr("version"),
        "Availability" : node.attr("availability")
      }
      console.log(opts);
      node.remove();
      var leader = getLeader();
      var removeOpts = {
        "leader" : leader,
        "remove" : opts
      }

      // console.log($(this));

      client.sendEvent("RemoveNode", removeOpts, (data)=>{

           client.sendEvent("ThrowNode", opts, (data)=>{
               console.log(data);
               console.log(nodeType);
               var finished = new dialog("Swarm & Node", data);
               finished.setDefaultButton('Close[Enker]', 'btn-primary create');
               finished.show();
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
          // var dialog = require("./module/dialog.js");

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

            var host = $("#leader").find("li").text();
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
            $(".load").hide();
            $(".update").show();
            $("#leave").show();
            $("#init").hide();

            var leader = getLeader();
            client.onlySendEvent(eventName , leader, (data)=>{
              console.log("loadSwarm");
              console.log(data.msg.JoinTokens);
              swarmToken.manager = data.msg.JoinTokens.Manager;
              swarmToken.worker = data.msg.JoinTokens.Worker;

              // setTimeout(()=>{location.reload(true)}, 3000);
            });
            client.sendEvent("LoadNode" , leader, (data)=>{
              // console.log(data.msg);
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
                var availability = data[i].Spec.Availability;
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
                var port = null;
                for(var i in hosts){
                  if(hosts[i].ip === hostIP){
                    port = hosts[i].port;
                  }
                }
                var $li = $("<li/>").attr({
                  class : "highlight loaded",
                  "ip" : hostIP ,
                  "port" : port,
                  "nodeID" : nodeID,
                  "version" : version,
                  "availability" : availability
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
                refresh();
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

});
