// client index.js
'use strict';

const columns = [{
      checkbox: true,
      title: 'Check'
  },{
      field: 'Id',
      title: '컨테이너 ID'
  }, {
      field: 'Names',
      title: '컨테이너 명',
      sortable : true,
      halign : "center",
      align : "center"
  }, {
      field: 'Image',
      title: '이미지',
      sortable : true,
      halign : "center",
      align : "center"
  }, {
      field: 'ImageID',
      title: '이미지 ID'
  }, {
      field: 'Command',
      title: '실행 명령어',
      sortable : true,
      halign : "center",
      align : "center"
  }, {
      field: 'Created',
      title: '생성일'
  }, {
      field: 'Ports',
      title: '포트'
  }, {
      field: 'Labels',
      title: '라벨',
      formatter : function (value , row, index){
        return JSON.stringify(value);
      }
  }, {
      field: 'State',
      title: '상태',
      sortable : true,
      halign : "center",
      align : "center"
  }, {
      field: 'Status',
      title: '상황'
  }, {
      field: 'HostConfig',
      title: 'HostConfig'
  }, {
      field: 'NetworkingSettings',
      title: 'NetworkingSettings'
  }, {
      field: 'Mounts',
      title: 'Mounts'
  }, {
      field: 'Attach',
      title: '컨테이너 접속',
      formatter : function (value , row, index){
        var button = "<button type='button' class='btn btn-success attach'>Attach</button>";
        return button
      }
  }];


$(function(){
  var $all = {};
  $all.init = function(){
    $("#terminal").hide();
  };
  $all.form = {};
  $all.form.$form = $("#hiddenForm");
  $all.form.settingMethod = {
    get : "getContainer",
    set : "setContainer"
  };

  $all.form.getSettingValue = function(self) {
    var self = self.data ;

    var opts = {
      Image : self.$image.text().trim(),
      name : self.$name.val(),
      Cmd : self.$command.val()
    }
    if(self.$volume.text().trim() !== "Volumes" && self.$containerDest.val() !== null){
      // opts.Mounts = [ self.$volume.text().trim + ":" + self.$containerDest];
      opts.volume = self.$volume.text().trim();
      opts.containerDest = self.$containerDest.val();
      // console.log(opts);

    }
    return opts;
  }
  $all.form.formName = "컨테이너 생성";
  $all.form.create = {};
  $all.form.create.data = {
    $imageMenu : $("#imageMenu"),
    $image : $('#imageDropDown'),
    $name : $("#name"),
    $command : $("#command"),
    $volumeMenu : $("#volumeMenu"),
    $volume : $("#volumeDropDown"),
    $containerDest : $("#containerDest"),
    $networkMenu : $("#networkMenu"),
    $network : $("#networkDropDown")
  };
  $all.form.create.$newForm =  $(".newForm");
  $all.form.create.formEvent = "CreateContainer";
  $all.form.create.portlists = [];
  $all.form.create.$portAdd = $(".portAdd");
  $all.form.create.$portlists = $(".portlists");
  $all.form.create.labellists = [];
  $all.form.create.$labelAdd = $(".labelAdd");
  $all.form.create.$labellists = $(".labellists");

  $all.form.create.initDropdown = function(self){
    var self = self.data;
    var jsonUrl = '/myapp/image/data.json';
    var $contextMenu =   self.$imageMenu;
    var $dropDown =   self.$image;
    var attr = "RepoTags";
    var index = 0;
    initDropdown(jsonUrl, $contextMenu, $dropDown, { attr : attr, index :  index} );

    var jsonUrl = '/myapp/volume/data.json';
    var $contextMenu =   self.$volumeMenu;
    var $dropDown =   self.$volume;
    var attr = "Name";

    initDropdown(jsonUrl, $contextMenu, $dropDown, { attr : attr } );

    var jsonUrl = '/myapp/network/data.json';
    var $contextMenu =   self.$networkMenu;
    var $dropDown =   self.$network;
    var attr = "Name";
    // var index = 0;
    initDropdown(jsonUrl, $contextMenu, $dropDown, { "attr" :  attr});

  }
  $all.form.create.more = {
    $more : $("#more"),
    $less : $("#less"),
    $moreForm : $(".moreForm")
  }

  $all.connect = {};
  $all.connect.dockerinfo = "container";
  $all.table = {};
  $all.table.main = {
    $table : $(".jsonTable"),
    hideColumns : ["Id", "ImageID", "Ports", "Mounts", "HostConfig", "NetworkingSettings", "Status"],
    columns : columns,
    jsonUrl : '/myapp/container/data.json',
    isExpend : true,
    clickRow : function  (e, row, $element, field) {

      if(field === "Attach"){
          if(row.State !== "running" && $("#terminal").is(":visible")){
            $("#terminal").hide();
          }
          else if($element.find(".exit").length > 0){
            $("#terminal").hide();
            $element.find(".exit").attr({
              class : "btn btn-success attach"
            }).text("Attach");
            if($terminal !== null){
              $terminal.destroy();
            }
          }
          else if(row.State === "running" ){
              $("#terminal").show();
              terminal(row.Id);
              $element.find(".attach").attr({
                class : "btn btn-danger exit"
              }).text("exit");

        }
      }
    }
  };

  $all.event = {};
  function clickDefault(client, eventName, table){
    return function(){
      client.sendEventTable(eventName, table);
    };
  }
  $all.event.create = {
      $button : $(".create"),
      eventName : "CreateContainer",
      clickEvent : clickDefault
  };
  $all.event.start = {
      $button : $(".start"),
      eventName : "StartContainer",
      clickEvent : clickDefault
  };
  $all.event.stop = {
      $button : $(".stop"),
      eventName : "StopContainer",
      clickEvent : clickDefault
  };
  $all.event.remove = {
      $button : $(".remove"),
      eventName : "RemoveContainer",
      clickEvent : clickDefault
  };
  $all.event.kill = {
      $button : $(".kill"),
      eventName : "KillContainer",
      clickEvent : clickDefault
  };
  $all.event.pause = {
      $button : $(".pause"),
      eventName : "PauseContainer",
      clickEvent : clickDefault
  };
  $all.event.unpause = {
      $button : $(".unpause"),
      eventName : "UnpauseContainer",
      clickEvent : clickDefault
  };
  $all.completeEvent = function(data, callback){
    if(hasValue(data)){
      var dialog = require("./module/dialog.js");

      var finished = new dialog("컨테이너", data);
      finished.setDefaultButton('Close[Enker]', 'btn-primary create');
      finished.show();

      callback;
    }
  };

    var main = require("./module/main.js");
    main.init($all);
    var containerTable = main.getMainTable();


     var expandinfo = [{
       url : "/myapp/container/top/",
       keys : ["Titles", "Processes"]
     },{
       url : "/myapp/container/stats/",
       keys : ["id", "name", "memory_stats", "networks", "cpu_stats", "Ports"]
     }];
     containerTable.expandRow(expandinfo);

     var client = main.getSocket();
     var $terminal = null;

     client.listen('stdout', function(data) {
       $terminal.echo(String(data));
     });
     client.listen('stderr', function(data) {
       $terminal.error(String(data));
     });
     client.listen('disconnect', function() {
       $terminal.disable();
     });
     client.listen('enable', function() {
       $terminal.enable();
     });
     client.listen('disable', function(data) {
       $terminal.disable();
     });

     function terminal(containerId){

       function userlogin(name, password, callback){
           if(name === "pirate"){
               callback("some token");
           } else {
               callback(false);
           }
       }

        $terminal =  $("#terminal").terminal((command, term) => {
         client.sendEvent('stdin', command);
         var cmd = $.terminal.parse_command(command);
         console.log(cmd);
         return ;

       }, {
         login : userlogin,
         prompt: containerId + " >",

         greetings: false,
         history : true,
         exit: true,
         onInit: function(term){
           term.echo("컨테이너 접속 완료");

           client.sendEvent('stdin', "docker attach " + containerId);
         },
         onBeforeLogin: function(term){
          //  console.log(term);
         },
         onBeforeCommand : function(term){
          //  console.log(term);
         },
         onExit : function(term){
          client.sendEvent('stdin', "exit");
          containerTable.reload();
          term.destroy();
           $("#terminal").hide();
         }
       });


     }
});

/// backspace 뒤로가기 막기
$(document).keydown(function(e){
  history.pushState(null, null, location.href);
    window.onpopstate = function(event) {
      history.go(1);
    };
});
