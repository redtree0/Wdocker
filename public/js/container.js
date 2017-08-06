// client index.js
'use strict';

// console.log(socket);
// var a = new t(socket);
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
      title: '라벨'
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
  }];


$(function(){

    var $detail = $(".detail");

    var $all = {
      $portlists : $(".portlists"),
      $imageMenu : $("#imageMenu"),
      $image : $('#image'),
      $name : $("#name"),
      $command : $("#command"),
      getSettingValue : function() {
        return {
          Image : this.$image.text().trim(),
          name : this.$name.val(),
          Cmd : this.$command.val()
        }
      },
      settingMethod : {
        get : "getContainer",
        set : "setContainer"
      },
      checkValue : function (json){
        if(this.$image.text().trim() === "Images"){
          return false;
        };

        for(var i in json){
          if(json[i] === null || json[i] === undefined){
            return false;
          }
        }
      }
      ,
      $plus : $(".plus"),
      $connect : $(".connect"),
      $form : $("#hiddenForm"),
      $portAdd : $(".portAdd"),
      $connectMenu : $("#connectMenu"),
      $connectButton : $("#connectButton"),
      $whoisConnected : $(".whoisConnected"),
      $connect : $(".connect"),
      $jsonTable : $(".jsonTable"),
      hideColumns : ["Id", "ImageID", "Ports", "Mounts", "HostConfig", "NetworkingSettings"],
      completeEvent : function(data, callback){
        if(hasValue(data)){
          var dialog = require("./dialog.js");

          var finished = new dialog("컨테이너", data.msg + data.statusCode, $("body"));
          finished.setDefaultButton('Close[Enker]', 'btn-primary create');
          // $("body").spinStop();
          finished.show();
          // containerTable.reload();
          callback;
        }
      }
    }
    initDropdown('/myapp/image/data.json', $all.$imageMenu, $all.$image, "RepoTags", 0);



    var view = require("./view.js");
    view.init($all, columns, "container");
    var containerTable = view.getMainTable();
    // // containerTable.checkAllEvents();
    // // containerTable.clickRowAddColor("danger");
    containerTable.clickRow($detail);
     var expandinfo = [{
       url : "/myapp/container/top/",
       keys : ["Titles", "Processes"]
     },{
       url : "/myapp/container/stats/",
       keys : ["id", "name", "memory_stats", "networks", "cpu_stats", "Ports"]
     }];
     containerTable.expandRow(expandinfo);

  //   $(".start").click((e)=>{
  //     client.sendEventTable("StartContainer", containerTable);
  //   });
  //
  //   $(".stop").click((e)=>{
  //       client.sendEventTable("StopContainer", containerTable);
  //   });
  //
  //   $(".remove").click((e)=>{
  //       client.sendEventTable("RemoveContainer", containerTable);
  //   });
  //
  //   $(".kill").click((e)=>{
  //       client.sendEventTable("KillContainer", containerTable);
  //   });
  //
  //   $(".pause").click((e)=>{
  //       client.sendEventTable("PauseContainer", containerTable);
  //   });
  //
  //   $(".unpause").click((e)=>{
  //       client.sendEventTable("UnpauseContainer", containerTable);
  //   });


});
