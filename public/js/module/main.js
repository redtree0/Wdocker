
"use strict";
// web cilent 기능 함축 클로저
var main = (function(){
    var settings = {};
    var Socket = require("./io");

    function getNewConnection(host){
      var socket = io({
        query: {
         token : host
        },
        secure : true
      }); /// wss
      return new Socket(socket, $('body'));
    }

    const LOCAL = getHostIP();
    var client = getNewConnection(LOCAL);
    var table = require("./table.js");
    var dialog = require("./dialog.js");

    const COMPLETE = {
      DO : true,
      NOT : false
    }

    return {
      /** @method  - init
       *  @description 객체 정보를 기반으로 필요한 기능 초기화
       *  @param {String} eventName - 소켓 이벤트 명
       *  @param {Object} $all - 사용자 정의 객체
       *  @param {Function} callback - 콜백 함수
       *  @return {Function} callback - callback
       */
        init: function($all,  callback) {
            var self = this;
            // console.log(self);
            settings = $all;

            /// dropDown click 했는지 확인
            // settings.clickDropdown = function ($dropdown, defaultVal) {
            //       if( ($dropdown.text()).trim() === defaultVal ){
            //         return false;
            //       }
            //       return true;
            // };

            /// json에 값이 유효한 지 확인
            settings.checkValue = function (json) {
                      for(var i in json){
                          if(json[i] === null || json[i] === undefined || json[i] === ""){
                              return false;
                        }
                  }
                return true;
            };


            if(settings.hasOwnProperty("init")){
              settings.init(); /// main 함수 이외에 초기화 해야할 내용 호출
            }

            /// table 초기화
            if(settings.hasOwnProperty("table")){
                /// main or sub 테이블 생성
                if(settings.table.hasOwnProperty("main")){
                  settings.mainTable = new table(settings.table.main.$table, settings.table.main.columns);
                }
                if(settings.table.hasOwnProperty("sub")){
                  settings.subTable = new table(settings.table.sub.$table, settings.table.sub.columns);
                }
                self.initTable();
            }

            self.setCompleteEvent(client);
            /// form 초기화
            self.initForm();


            /// connect 초기화
              self.connectDocker();

              /// button click event 후 socket event 실행 기능
              self.socketButtonEvent(client);


            if(typeof callback === "function"){
              return callback;
            }
        },
        /** @method  - getMainTable
         *  @description 메인 테이블 겍체 GET, main 외 바깥에서 호출하는 함수
         */
        getMainTable : function(){
          return settings.mainTable;
        },
        /** @method  - getSubTable
         *  @description 서브 테이블 겍체 GET, main 외 바깥에서 호출하는 함수
         */
        getSubTable : function(){
          return settings.subTable;
        },
        /** @method  - getSocket
         *  @description  소켓 겍체 GET, main 외 바깥에서 호출하는 함수
         */
        getSocket : function(){
          return client;
        },
        /** @method  - getDialog
         *  @description  Dialog 겍체 GET, main 외 바깥에서 호출하는 함수
         */
        getDialog : function (){
          return dialog;
        },
        setCompleteEvent : function(client){
          if(!settings.hasOwnProperty("completeEvent")){
            return ;
          }
          client.completeEvent = settings.completeEvent;
        }
        ,
        /** @method  - initTable
         *  @description 테이블 초기화 및 테이블 이벤트 생성
         */
        initTable: function(){
          var self = this;
          self.mainTableInit();
          self.subTableInit();

        },
          mainTableInit : function(){
            if(!settings.table.hasOwnProperty("main")){
                return ;
            }
              /// 메인 테이블
              /// 메인 테이블은 json GET으로 테이블 생성
                var self = settings.table.main;
                var mainTable =  settings.mainTable;
                var isExpend = false;

                if(self.hasOwnProperty("isExpend") && self.isExpend === true){
                  /// 테이블에 expand Row 초기화
                  /// 테이블 좌측에 + 버튼 클릭 시 ROW 확장
                  isExpend = self.isExpend; // expend 될 시 표기할 데이터 필터 함수
                }
                mainTable.initUrlTable(self.jsonUrl, isExpend); // 테이블 초기화
                // mainTable.refresh(self.jsonUrl);
                if(self.hasOwnProperty("hideColumns")){
                  /// 테이블 중 기본으로 감출 컬럼은 숨김
                  mainTable.hideColumns(self.hideColumns);
                }

                mainTable.checkAllEvents(); /// checked Box 클릭 이벤트

                mainTable.clickRowAddColor("success"); /// 테이블 클릭 시 색상 변경

                if(self.hasOwnProperty("clickRow")){
                  /// 테이블 Row 클릭 시 이벤트 정의
                  /// self.clickRow 가 Row 클릭 후 실행될 callback 함수
                  self.$table.on("click-row.bs.table", self.clickRow );
                }

                if(self.hasOwnProperty("loaded")){
                  self.loaded(client, LOCAL,  mainTable);
                }

          }
        ,
          subTableInit : function(){
                if(!settings.table.hasOwnProperty("sub")){
                    return ;
                }
                  /// 서브 테이블
                  /// 서브 테이블은 json Data로 생성

                  var self = settings.table.sub;
                  var subTable = settings.subTable;
                  var isJsonUrl = false;
                  if(self.hasOwnProperty("jsonUrl")){
                    isJsonUrl = true;
                  }

                    if(isJsonUrl){
                      subTable.initUrlTable(self.jsonUrl, false); // 테이블 초기화
                    }else {
                      subTable.initDataTable({}); // 테이블 초기화
                    }
                    subTable.checkAllEvents(); /// checked Box 클릭 이벤트

          }
        ,
        /** @method  - initForm
         *  @description 생성 및 갱신 Form 초기화
         */
        initForm : function(){
          if(!settings.hasOwnProperty("form")){
            return ;
          }
          var self = this;
          self.hideForm();   /// form hide 감춤
          self.showForm(client);   /// form show 보임

          self.initPortLists();
          self.initLabelLists();
        },
        /** @method  - hideForm
         *  @description Form 숨김
         */
        hideForm : function(){
          if(!settings.hasOwnProperty("form")){
            return ;
          }
          settings.form.$form.hide();
        },
        /** @method  - showForm
         *  @description Form 보임
         */
        showForm : function( client , host ){
          if(!settings.hasOwnProperty("form")){
            return;
          }
          if(!settings.form.hasOwnProperty("create")){
            return;
          }
          var self = settings.form.create;
          settings.$body = $("body");
          self.$newForm.off();
          self.$newForm.click((e)=>{
            e.preventDefault();

            var popup = new dialog(self.formName, settings.form.$form.show());
            /// popup 창 초기화

            if(self.hasOwnProperty("initDropdown")){
                /// form 에서 dropdown 초기화
                self.initDropdown(self, host);
            }
            if(self.hasOwnProperty("loaded")){
              self.loaded(client);
            }
            if(self.hasOwnProperty("more")){
                  //// form 에서 추가로 설정해야 되는 form을 정의 해놈
                  var more = self.more;
                  var $moreForm = more.$moreForm;
                  var $more = more.$more;
                  var $less = more.$less;
                  $moreForm.hide();
                  $less.hide();
                  if(($more).is(':visible') === false ){
                    $moreForm.hide(); //// 추가 form 사라짐
                    $more.show(); //// more 버튼 보임
                    $less.hide();  /// less  버튼 사라짐
                  }else {
                    $moreForm.show();   //// 추가 form 보임
                    $more.hide();  //// more 버튼 사라짐
                    $less.show();  /// less  버튼 보임
                  }

                  /// more 버튼 클릭 후
                  $more.click((e)=>{
                    $moreForm.show();   //// 추가 form 보임
                    $more.hide();  //// more 버튼 사라짐
                    $less.show();  /// less  버튼 보임
                  });

                  /// less 버튼 클릭 후
                  $less.click((e)=>{
                    $moreForm.hide(); //// 추가 form 사라짐
                    $more.show(); //// more 버튼 보임
                    $less.hide();  /// less  버튼 사라짐
                  });
            }

            /// pop 창 버튼 추가
            popup.appendButton('Create', 'btn-primary create', clickPopupButton);

            popup.show();

            function clickPopupButton(dialogItself){

                    function setSettings (json, labellists, portArray){
                      var config = require("./config");
                      var self = settings.form.settingMethod;
                      config[self.set](json, labellists, portArray);

                      return  config[self.get]();
                    }
                    // console.log(self.getSettingValue());
                    // console.log(self.labellists);
                    var opts = setSettings(settings.form.getSettingValue(self), self.labellists,  self.portlists ); /// docker 데이터 설정
                    // console.log(opts);
                    if(settings.checkValue(opts)){ /// opts 값 null, undefind , "" 존재 확인

                        if( self.hasOwnProperty("completeEvent") ){
                          client.completeEvent = self.completeEvent;
                        }

                        if( self.hasOwnProperty("callback") ){
                          // console.log("called callback");
                          client.sendEventTable(self.formEvent, settings.mainTable, opts, self.callback);
                        }else {
                          // console.log("called");
                          client.sendEventTable(self.formEvent, settings.mainTable, opts);
                        }

                    }else {
                      console.log("more value");
                    }

            }
            //
          });
        },

        /** @method  - connectDocker
         *  @description docker host 연결 기능
         */
        connectDocker : function(){
          if(!settings.hasOwnProperty("connect")){
                return ;
          }
          var that = this;
          var self = settings.connect;
          self.$connectMenu = $("#connectMenu"); /// docker 연결가능한 호스트 목록
          self.$connectDropDown = $("#connectDropDown"); /// dropdown button
          self.$IsConnected = $("#IsConnected"); /// docker가 누구랑 연결되어 있는지 표시창
          self.$connectButton = $(".connectButton"); /// docker connect Event 버튼
         //
          const JSONURL = '/myapp/settings/data.json';
          const ATTR = "ip";
          /// dropdown button 초기화
          initDropdown(JSONURL, self.$connectMenu, self.$connectDropDown, {attr : ATTR});
          self.$IsConnected.text(LOCAL);

          self.$connectButton.click((e)=>{

              var newHost = self.$connectDropDown.text().trim();
              if(newHost === "Connect Docker"){
                return;
              }

              client.disconnect();
              client = getNewConnection(newHost);

               self.$IsConnected.text(newHost);
               /// completeEvent 함수 초기화
               that.setCompleteEvent(client);


                 var jsonUrl = settings.table.main.jsonUrl;

                 var newJsonUrl = getNewJsonUrl(jsonUrl);

                  settings.mainTable.refresh(newJsonUrl);
                  // $("body").off();
                  that.offSocketButtonEvent();
                  that.socketButtonEvent(client);

                  // settings.form.create.initDropdown(settings.form.create, jsonUrl);
                  that.showForm(client, newHost);

                  if(settings.table.main.hasOwnProperty("loaded")){
                    settings.table.main.loaded(client, newHost,  settings.mainTable);
                  }

                 function getNewJsonUrl(url){
                   var org = url;
                   var tmp = org.split("/");
                   tmp.pop();

                   var newUrl = (tmp.join("/") + "/"+  $("#connectDropDown").text());
                  //  console.log(newUrl);
                   return newUrl;
                 }

         });
       },
       /** @method  - initPortLists
        *  @description form 에서 port 정보 추기 및 삭제 기능
        */
       initPortLists : function(){
         if(!settings.form.create.hasOwnProperty("$portlists")){
           return;
         }
         /// form에서 port 추가 및 삭제 기능 초기화
         var self = settings.form.create;
         var $protocol = $("#protocol"); /// tcp, udp 중 선택
         var $containerPort = $("#containerPort"); /// 컨테이너 노출 포트
         var $hostPort = $("#hostPort"); /// 호스트 노출 포트
         var $dataLists = [$protocol, $containerPort, $hostPort];

         initPortLists(self.$portlists, self.portlists, self.$portAdd,  $dataLists  );
       },
       /** @method  - initLabelLists
        *  @description form 에서 port 정보 추기 및 삭제 기능
        */
       initLabelLists : function(){
         if(!settings.form.create.hasOwnProperty("$labellists")){
            return ;
         }
         /// form에서 port 추가 및 삭제 기능 초기화
         var self = settings.form.create;
         var $key = $("#key");
         var $value = $("#value");
         var $dataLists = [$key, $value];

         initPortLists(self.$labellists, self.labellists, self.$labelAdd,  $dataLists  );
       },
       /** @method  - socketButtonEvent
        *  @description 버튼 클릭시 발생하는 소켓 이벤트 초기화
        */
        socketButtonEvent : function (client){
          if(!settings.hasOwnProperty("event")){
              return ;
          }
          var self = settings;

          for (var i in self.event) {
            /// button event를 loop로 초기화
            // console.log(self.event[i]);
            // console.log(self.event[i].eventName);
            self.event[i].$button.click(
              self.event[i].clickEvent(client, self.event[i].eventName, self.mainTable) /// clickEvent 클로저
            );
          }
        },
        offSocketButtonEvent : function(){
          if(!settings.hasOwnProperty("event")){
              return ;
          }
          var self = settings;
          for (var i in self.event) {
            self.event[i].$button.off();
          }
        }


    }

})();

module.exports = main;
