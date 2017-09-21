//images.js
'use strict';

  const columns = [{
          checkbox: true,
          title: 'Check'
      },{
          field: 'RepoTags',
          title: '이미지',
          sortable : true,
          halign : "center",
          align : "center",
          width : "30%",
          formatter : function (value , row, index){

            var mine = value.map((value)=>{
              return "<li><label>" +  "<input type='radio' name='optradio' value='"+ value + "'>  " + value + "</label></li>"
            })

            var result = "<ul class='text-left mlist'>" + mine.join("") + "</ul>"
            return result;
          }
      }
      ,{
          field: 'Created',
          title: '생성일',
          halign : "center",
          align : "center"
      },{
          field: 'Id',
          title: '이미지 Id',
          sortable : true,
          halign : "center",
          align : "center"
      }, {
          field: 'Labels',
          title: '라벨',
          sortable : true,
          halign : "center",
          align : "center",
          formatter : function (value , row, index){
            return JSON.stringify(value);
          }
      },{
          field: 'ParentId',
          title: '부모 Id'
      },{
          field: 'RepoDigests',
          title: 'RepoDigests'
      },{
          field: 'Size',
          title: 'Size',
          halign : "center",
          align : "center"
      }
    ];
      const searchcolumns = [{
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
  const COMPLETE = {
    DO : true,
    NOT : false
  }
  var dialog = require("./module/dialog.js");
  var $all = {};
  $all.init = function(){
    $(".results").hide();
    $("#expand").hide();
  };
  $all.form = {};
  $all.form.$form = $("#hiddenForm");
  $all.form.settingMethod = {
    get : "getImage",
    set : "setImage"
  };
  $all.form.getSettingValue = function(self) {
    var self = self.data ;
    return {
      "term" : self.$term.val(),
      "limit" : self.$limit.val(),
      "is-automated" : self.$is_automated.prop("checked").toString(),
      "is-official" : self.$is_official.prop("checked").toString()
    }
  };

  $all.form.create = {};
  $all.form.create.data = {
    $term : $("#term"),
    $limit : $("#limit"),
    $is_automated : $("#is_automated"),
    $is_official : $("#is_official")
  };

  $all.form.create.$newForm =  $(".newForm");
  $all.form.create.formName = "이미지 생성";
  $all.form.create.formEvent = "SearchImages";
  // $all.form.create.labellists = [];
  // $all.form.create.$labelAdd = $("#labelAdd");
  // $all.form.create.$labellists = $("#labellists");
  $all.form.create.callback = function(data){
            var row = data.msg ;
            // console.log(row);
            $all.table.sub.$table.bootstrapTable('load', row);

            $(".results").show();
  }
  $all.form.create.loaded = function(client){
    var $msgdiag = $("#msgdiag");
    $msgdiag.hide();
    $(".download").off();
    $(".download").click((e)=> {
          e.preventDefault();

        client.completeEvent = function(data, callback){
             if(hasValue(data)){

                  var finished = new dialog("이미지", JSON.stringify(data));
                  finished.setDefaultButton('Close[Enker]', 'btn-primary create');
                  finished.show();
                  callback;
              }
          }
          console.log(client);
          client.sendEventTable("PullImages", searchTable);
          var $progressbar = $(".progress-bar");
          $progressbar.css("width", '0%');
          // console.log($progressbar);
          // console.log($msgdiag);
          var popup = new dialog("이미지 다운 중", $msgdiag.show());
          // console.log(popup);
          var $status = $("#status");
          client.listen("progress", (event)=> {
              // console.log(event);
                if((event.status)){
                  $status.text(event.status);
                }
                if((event.progressDetail)){
                  var download = event.progressDetail;
                  if(download.current && download.total){
                    var percentage = (download.current / download.total) * 100;
                    var $progress = $(".progress");
                    // console.log($progress);
                    if(percentage != NaN) {
                      $progress.css("width", Math.round(percentage)+ '%');
                    }
                  }
                }else if (event === true) {
                    popup.close(5000);
                    $(".results").hide();
                    refresh();
                }
            });

            popup.show();
    });

  }

  $all.form.completeEvent = function(data, callback){
    // console.log(arguments);
    if(hasValue(data)){
      return callback(data.msg);
    }
  };
  $all.connect = {};

  $all.table = {};
  $all.table.main = {
    $table : $(".jsonTable"),
    hideColumns : ["Id",  "ParentId", "Created", "RepoDigests"],
    columns : columns,
    jsonUrl : '/myapp/image/data/'+ getHostId(getHostIP()),
    isExpend : false
  };
  $all.table.sub = {
    $table : $(".dataTable"),
    columns : searchcolumns
  }

  $all.event = {};
  function clickDefault(client, eventName, table){
    return function(){
      client.sendEventTable(eventName, table);
    };
  }

  $all.event.remove = {
      $button : $(".remove"),
      eventName : "RemoveImages",
      clickEvent : clickDefault
  };

  $all.event.tag = {
      $button : $("#tag"),
      eventName : "TagImages",
      clickEvent : (client, eventName, table)=>{
        return function(){
          var imageTag = $("#rename").val();
          if(imageTag === null || imageTag === "" || imageTag === undefined){
            return;
          }
          if(imageTag.split(":").length <= 1){
            return ;
          }
          if(imageTag.split(":").includes("")){
            return ;
          }
          var lists = table.getCheckedLists();
          if(lists.length !== 1){
            console.log("check Table");
            return ;
          };
          // console.log(table.getCheckedLists());
          // console.log(imageTag.split(":"));
          // console.log(lists[0].RepoTags[0]);
          var opts = {
                     repo : imageTag.split(":")[0],
                     tag : imageTag.split(":")[1],
                     orgImage : lists[0].RepoTags[0]
          };
          // console.log(opts);
          // return ;
          client.sendEventTable(eventName, opts);
        };
      }
  };

  $all.event.push = {
      $button : $("#push"),
      eventName : "PushImages",
      clickEvent : (client, eventName, table)=>{
        return function(){
          var checkedImage = $('.mlist li label input[name=optradio]:checked').val();
          // console.log( $('.mlist li label input[name=optradio]:checked').closest('tr'));
          if(checkedImage === undefined){
            return ;
          }
          $.getJSON("/myapp/auth/data.json", function(json, textStatus) {
              // console.log(json.username);
              var repo = checkedImage.split("/")[0];
              var username = json[0].username;
              if(repo !== username){
                console.log("check Image");
                return ;
              }
              var opts = {
                name : checkedImage.split(":")[0],
                tag : checkedImage.split(":")[1]
              };
              client.sendEvent(COMPLETE.NOT, "PushImages", opts);
              var $pushingImage = $("#pushingImage");
              var popup = new dialog("이미지 업로드 중", $pushingImage.show());
              client.listen("pushingImage", (data)=>{
                if(data=== true){
                  popup.close(5000);
                }
                $pushingImage.append(data.status + "<br/>");
              });

              popup.show();
          });

        }
      }
  };
  //
  $all.completeEvent = function(data, callback){
    if(hasValue(data)){
      var finished = new dialog("이미지", data);
      finished.setDefaultButton('Close[Enker]', 'btn-primary create');
      finished.show();
      callback;
    }
  };


    var main = require("./module/main.js");
    main.init($all);

        var searchTable = main.getSubTable();


        searchTable.$table.on("check.bs.table",  function (e, row, $element) {  /// 테이블 한 Row check box 선택 시
          $(':checkbox').not(this).prop('checked', false);
          $element.prop('checked', true);
        });

        searchTable.$table.on("check-all.bs.table",  function (e, row, $element) {  /// 테이블 한 Row check box 선택 시
          $(':checkbox').prop('checked', false);
        });


});
