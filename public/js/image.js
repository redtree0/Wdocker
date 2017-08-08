//images.js
'use strict';

  var columns = [{
          checkbox: true,
          title: 'Check'
      },{
          field: 'RepoTags',
          title: 'RepoTags'
      }
      ,{
          field: 'Containers',
          title: 'Containers'
      }
      ,{
          field: 'Created',
          title: 'Created'
      },{
          field: 'Id',
          title: 'Id'
      },{
          field: 'Labels',
          title: 'Labels'
      },{
          field: 'ParentId',
          title: 'ParentId'
      },{
          field: 'RepoDigests',
          title: 'RepoDigests'
      },{
          field: 'SharedSize',
          title: 'SharedSize'
      },{
          field: 'Size',
          title: 'Size'
      },{
          field: 'VirtualSize',
          title: 'VirtualSize'
      }];
      var searchcolumns = [{
              checkbox: true,
              title: 'Check'
        },{
          field: 'star_count',
          title: 'star_count'
        }, {
          field: 'is_official',
          title: 'is_official'
        }, {
          field: 'name',
          title: 'name'
        }, {
          field: 'is_automated',
          title: 'is_automated'
        }, {
          field: 'description',
          title: 'description'
        }];


$(function(){

  var $all = {};
  $all.init = function(){};
  $all.form = {};
  $all.form.data = {
    $imageMenu : $("#imageMenu"),
    $image : $('#imageDropDown'),
    $name : $("#name"),
    $command : $("#command")
  };
  $all.form.$newForm =  $(".newForm");
  $all.form.formName = "컨테이너 생성";
  $all.form.$form = $("#hiddenForm");
  $all.form.formEvent = "CreateContainer";
  $all.form.portlists = [];
  $all.form.$portAdd = $(".portAdd");
  $all.form.$portlists = $(".portlists");
  $all.form.dropDown = {
    $dropDown : $('#imageDropDown'),
    default : "Images"
  };
  $all.form.settingMethod = {
    get : "getContainer",
    set : "setContainer"
  };
  $all.form.getSettingValue = function() {
    var self = this.data ;
    return {
      Image : self.$image.text().trim(),
      name : self.$name.val(),
      Cmd : self.$command.val()
    }
  }

  $all.form.initDropdown = function(){
    var self = this;
    var jsonUrl = '/myapp/image/data.json';
    var $contextMenu =   self.data.$imageMenu;
    var $dropDown =   self.data.$image;
    var attr = "RepoTags";
    var index = 0;
    return initDropdown(jsonUrl, $contextMenu, $dropDown, attr, index);
  }
  $all.connect = {};
  $all.connect.dockerinfo = "container";
  $all.table = {};
  $all.table.$jsonTable = $(".jsonTable");
  $all.table.hideColumns = ["Id", "ImageID", "Ports", "Mounts", "HostConfig", "NetworkingSettings"];
  $all.table.columns = columns;
  $all.table.jsonUrl = '/myapp/image/data.json';
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
  $all.event.remove = {
      $button : $(".remove"),
      eventName : "RemoveImages",
      clickEvent : clickDefault
  };
  $all.event.kill = {
      $button : $(".kill"),
      eventName : "KillContainer"
  };
  $all.event.pause = {
      $button : $(".pause"),
      eventName : "PauseContainer"
  };
  $all.event.unpause = {
      $button : $(".unpause"),
      eventName : "UnpauseContainer"
  };
  $all.completeEvent = function(data, callback){
    // console.log(arguments);
    // if(hasValue(data)){
    //   searchTable.load(data.msg);
    //   searchTable.checkAllEvents();
    //   $(".results").show();
    //   callback;
    // }
  };

    var main = require("./main.js");
    main.init($all);
        // var socket = io();
        // var Socket = require("./io");
        // var client = new Socket(socket, $('body'));
        // var spin = require("./spinner");
        // var dialog = require("./dialog");
        //
        // var imageslist =[];
        // var searchlist =[];
        // var $image = $(".jsonTable");
        // var table = require("./table.js");
        // var imageTable = new table($image, columns);
        // var searchTable = new table($(".dataTable"), searchcolumns);
        //
        //
        // imageTable.initUrlTable('/myapp/image/data.json', false);
        // // imageTable.hideColumns(["Id", "ImageID", "Ports", "Mounts", "HostConfig", "NetworkingSettings"]);
        // imageTable.checkAllEvents();
        // // imageTable.clickRow($detail);
        // imageTable.clickRowAddColor("danger");
        // // initUrlTable($image, columns,'/myapp/images/data.json');
        // searchTable.initDataTable();
        //
        //
        var client = main.getSocket();
        var dialog = main.getDialog();
        var $msgdiag = $("#msgdiag");
        $msgdiag.hide();
        $(".download").click((e)=> {
          e.preventDefault();


        client.completeEvent = function(data, callback){
             if(hasValue(data)){

                  var finished = new dialog("이미지", JSON.stringify(data), $("body"));
                  finished.setDefaultButton('Close[Enker]', 'btn-primary create');
                  finished.show();
                  callback;
              }
          }
          client.sendEventTable("PullImages", searchTable);
          var $progress = $(".progress-bar");
          $progress.css("width", '0%');
          var popup = new dialog("이미지 다운 중", $msgdiag.show(), $("body"));
          var $status = $("#status");
          client.listen("progress", (event)=> {

            console.log(event);
            if((event.status)){
              $status.text(event.status);
            }
            if((event.progressDetail)){
              var download = event.progressDetail;
              if(download.current && download.total){

                var percentage = (download.current / download.total) * 100;
                // $msgdiag.text(percentage);
                var $progress = $(".progress");
                if(percentage != NaN) {
                  // console.log(percentage);
                  $progress.css("width", Math.round(percentage)+ '%');
                }

              }
            }else if (event === true) {
                popup.close(5000);
                imageTable.reload();
            }


            });

            popup.show();
          });
        //
        //
        //
        //
        //
        // $(".remove").click((e)=> {
        //   client.completeEvent = function(data, callback){
        //     if(hasValue(data)){
        //
        //       var finished = new dialog("이미지", JSON.stringify(data), $("body"));
        //       finished.setDefaultButton('Close[Enker]', 'btn-primary create');
        //       finished.show();
        //       callback;
        //     }
        //   }
        //
        //   client.sendEventTable("RemoveImages", imageTable);
        // });
        //
        //
        // function imageSettings(term, limit, is_automated, is_official, stars){
        //       var config = require("./config");
        //       // var opts = settings.container;
        //
        //       if (hasValue(term, limit, is_automated, is_official)) {
        //             var opts = {
        //               "term" : term, "limit" : limit, "is-automated" : is_automated,
        //               "is-official" : is_official, "stars" : stars
        //             };
        //
        //             config.setImage(opts);
        //        };
        //       return  config.getImage();
        // }
        //
        // var $form = $("#SearchImages");
        // $form.hide();
        // $(".results").hide();
        // $(".plus").click((e)=>{
        //     e.preventDefault();
        //     var popup = new dialog("이미지 생성", $form.show(), $("body"));
        //     popup.appendButton('Search', 'btn-primary create',
        //               function(dialogItself){
        //
        //                 var term=$("#term").val();
        //                 var limit =$('#limit').val();
        //                 var is_automated = $('#is_automated').prop('checked').toString();
        //                 var is_official = $('#is_official').prop('checked').toString();
        //                 var stars = $("#stars").val();
        //                 var opts = imageSettings(term, limit, is_automated, is_official, stars);
        //
        //                 client.completeEvent =  function (data, callback){
        //                     if(hasValue(data)){
        //                       searchTable.load(data.msg);
        //                       searchTable.checkAllEvents();
        //                       $(".results").show();
        //                       callback;
        //                     }
        //                   }
        //                 client.sendEventTable("SearchImages", searchTable, opts);
        //
        //               });
        //
        //    popup.show();
        // });


});
