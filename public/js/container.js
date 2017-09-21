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
  const COMPLETE = {
    DO : true,
    NOT : false
  }
  var dialog = require("./module/dialog.js");

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
        name : self.$name.val(),
        Cmd : self.$command.val()
      }
      var image = self.$image.text().trim();
      var volume = self.$volume.text().trim();
      var containerDest = self.$containerDest.val();
      var network = self.$network.text().trim();

      if(image !== "Images"){
        opts.Image = image;
      }
      if(volume !== "Volumes" && containerDest !== null){
        opts.volume = volume;
        opts.containerDest = containerDest;
      }
      if(network !== "Networks"){
        var networkLists = self.networkLists;
        for(var i in networkLists){
          if(network === networkLists[i].Name){
            opts.networkID =  networkLists[i].Id;
          }
        }

      }
      return opts;
  }
  $all.form.create = {};
  $all.form.create.formName = "컨테이너 생성";
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
  $all.form.create.$portAdd = $("#portAdd");
  $all.form.create.$portlists = $("#portlists");
  $all.form.create.labellists = [];
  $all.form.create.$labelAdd = $("#labelAdd");
  $all.form.create.$labellists = $("#labellists");

  $all.form.create.initDropdown = function(self, host){

    var self = self.data;
    var jsonUrl = null
    var hostId = null;
    if(host === null || host === undefined){
      hostId = getHostId(getHostIP());
    }else {
      hostId = getHostId(host);
    }
    //   jsonUrl = "/myapp/image/data/" + local;
    // }else {
    //   jsonUrl = "/myapp/image/data/" + host;
    // }
    jsonUrl = "/myapp/image/data/" + hostId;
    // console.log(jsonUrl);
    // jsonUrl = '/myapp/image/data.json';
    var $contextMenu =   self.$imageMenu;
    var $dropDown =   self.$image;
    var attr = "RepoTags";
    var index = 0;
    initDropdown(jsonUrl, $contextMenu, $dropDown, { attr : attr, index :  index} );

    // if(host === null || host === undefined){
    //   jsonUrl = "/myapp/volume/data/" + local;
    // }else {
    //   jsonUrl = "/myapp/volume/data/" + host;
    // }
    jsonUrl = "/myapp/volume/data/" + hostId;
    // console.log(jsonUrl);

    // jsonUrl = '/myapp/volume/data.json';
    var $contextMenu =   self.$volumeMenu;
    var $dropDown =   self.$volume;
    var attr = "Name";

    initDropdown(jsonUrl, $contextMenu, $dropDown, { attr : attr } );

    // if(host === null || host === undefined){
    //   jsonUrl = "/myapp/network/data/" + local;
    // }else {
    //   jsonUrl = "/myapp/network/data/" + host;
    // }
    jsonUrl = "/myapp/network/data/" + hostId;
    // console.log(jsonUrl);
    // jsonUrl = '/myapp/network/data.json';
    var $contextMenu =   self.$networkMenu;
    var $dropDown =   self.$network;
    var attr = "Name";
    // var index = 0;
    initDropdown(jsonUrl, $contextMenu, $dropDown, { "attr" :  attr});

    $.getJSON(jsonUrl, function(json, textStatus) {
      function filterByIdName(obj){
        var robj = {
          networkID : obj.Id,
          Name : obj.Name
        }
        return robj;
      }
      var networkLists = json.map(filterByIdName);
      self.networkLists = networkLists;

    });

  }
  $all.form.create.more = {
    $more : $("#more"),
    $less : $("#less"),
    $moreForm : $(".moreForm")
  }

  $all.connect = {};

  $all.table = {};
  $all.table.main = {
    $table : $(".jsonTable"),
    hideColumns : ["Id", "ImageID", "Ports", "Mounts", "HostConfig", "Labels", "NetworkingSettings", "Status"],
    columns : columns,
    jsonUrl : '/myapp/container/data/' + getHostId(getHostIP()),
    isExpend : false,
    clickRow : function  (client, row, $element, field) {
      // console.log("click");
      if(field === "Attach"){

          if(row.State !== "running" && $("#terminal").is(":visible")){
            // console.log("hide");
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
              // console.log($("#terminal"));
              $("#terminal").show();
              // console.log(row);
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

      var finished = new dialog("컨테이너", data);
      finished.setDefaultButton('Close[Enker]', 'btn-primary create');
      finished.show();

      callback;
    }
  };
  // var mine = null;
  // $.getJSON('/myapp/settings/data.json', function(json, textStatus) {
  //   // console.log(json);
  //   mine = json;
  //   console.log(mine);
  //   // return json;
  // });
  // $all.getId = function(){
  //   return mine;
  // }
    var main = require("./module/main.js");
    main.init($all);
    var containerTable = main.getMainTable();


     var $terminal = null;

     function terminal(containerId){
        var client = main.getSocket();
          // console.log(containerId);
          client.listen('AttachStderr', function(data) {
            $terminal.error(String(data));
          });
          client.listen('AttachStdout', function(data) {
            $terminal.echo(String(data));
          });
          client.listen('AttachEnable', function() {
            $terminal.enable();
          });

           function userlogin(name, password, callback){
             $.getJSON("/myapp/terminal/data.json",(data)=>{
               var user = null;
               var pass = null;
               if(data.length > 0){
                 user = (data[0].user);
                 pass = (data[0].password);
               }else {
                 user = "admin";
                 pass = "admin";
               }
               if((name === user) && (password === pass)){
                 callback("some token");
               } else {
                 callback(false);
               }
             });
           }
          //  console.log($terminal);
            $terminal =  $("#terminal").terminal((command, term) => {
              // client.sendEvent(COMPLETE.NOT,'stdin', command);
                 client.sendEvent(COMPLETE.NOT,'AttachStdin', command);
                 var cmd = $.terminal.parse_command(command);
                 return ;

           }, {
                 login : userlogin,
                 prompt: containerId.substring(0,16) + "# ",
                 greetings: false,
                 history : true,
                 exit: true,

                 onInit: function(term){
                       term.echo("컨테이너 접속 완료");

                       client.sendEvent(COMPLETE.NOT,'AttachContainer', containerId);
                 },
                 onBeforeLogin: function(term){
                  //  console.log(term);
                 },
                 onBeforeCommand : function(term){
                  //  console.log(term);
                 },
                 onExit : function(term){
                      client.sendEvent(COMPLETE.NOT,'AttachStdin', "exit");
                      containerTable.refresh();
                      term.destroy();
                       $("#terminal").hide();
                      refresh();
                 }
           });

          //  console.log($terminal);

     }
});

/// backspace 뒤로가기 막기
$(document).keydown(function(e){
  // console.log(e.keyCode);
  history.pushState(null, null, location.href);
    window.onpopstate = function(event) {
      history.go(1);
    };
});
