
"use strict";
// web cilent 기능 함축 클로저
var main = (function(){
    var settings = {};
    var socket = io();
    var Socket = require("./io");
    var client = new Socket(socket, $('body'));
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
            settings = $all;

            // settings.$body = $("body");

            /// dropDown click 했는지 확인
            settings.clickDropdown = function ($dropdown, defaultVal) {
                  if( ($dropdown.text()).trim() === defaultVal ){
                    return false;
                  }
                  return true;
                };

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

            /// completeEvent 함수 초기화
            if(settings.hasOwnProperty("completeEvent")){
              client.completeEvent = settings.completeEvent;
            }

            /// form 초기화
            if(settings.hasOwnProperty("form")){
              self.initForm();
              if(settings.form.hasOwnProperty("update")){
                /// update form 초기화
                self.initUpdate();
              }
            }

            /// connect 초기화
            if(settings.hasOwnProperty("connect")){
              self.connectDocker();
            }

            if(settings.hasOwnProperty("event")){
              /// button click event 후 socket event 실행 기능
              self.socketButtonEvent();
            }
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
        /** @method  - initTable
         *  @description 테이블 초기화 및 테이블 이벤트 생성
         */
        initTable: function(){
          if(settings.table.hasOwnProperty("main")){
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

              if(self.hasOwnProperty("hideColumns")){
                /// 테이블 중 기본으로 감출 컬럼은 숨김
                mainTable.hideColumns(self.hideColumns);
              }

              mainTable.checkAllEvents(); /// checked Box 클릭 이벤트

              mainTable.clickRowAddColor("danger"); /// 테이블 클릭 시 색상 변경

              if(self.hasOwnProperty("clickRow")){
                /// 테이블 Row 클릭 시 이벤트 정의
                /// self.clickRow 가 Row 클릭 후 실행될 callback 함수
                self.$table.on("click-row.bs.table", self.clickRow );
              }
          }

          if(settings.table.hasOwnProperty("sub")){
            /// 서브 테이블
            /// 서브 테이블은 json Data로 생성

            var self = settings.table.sub;
            var state = false;
            if(self.hasOwnProperty("jsonUrl")){
              state = true;
            }
            (function(){
              if(state){
                this.initUrlTable(self.jsonUrl, false); // 테이블 초기화
              }else {
                this.initDataTable({}); // 테이블 초기화
              }
              this.checkAllEvents(); /// checked Box 클릭 이벤트
            }).call(settings.subTable);
          }

        },
        /** @method  - initForm
         *  @description 생성 및 갱신 Form 초기화
         */
        initForm : function(){
          var self = this;
          self.hideForm();   /// form hide 감춤
          self.showForm();   /// form show 보임
          if(settings.form.create.hasOwnProperty("$portlists")){
            self.initPortLists();
          }
          if(settings.form.create.hasOwnProperty("$labellists")){
            self.initLabelLists();
          }
          // if(settings.hasOwnProperty("event")){
          //   /// button click event 후 socket event 실행 기능
          //   self.socketButtonEvent();
          // }

        },
        /** @method  - hideForm
         *  @description Form 숨김
         */
        hideForm : function(){
          settings.form.$form.hide();
        },
        /** @method  - showForm
         *  @description Form 보임
         */
        showForm : function(){
          var self = settings.form.create;
          settings.$body = $("body");
          self.$newForm.click((e)=>{
            e.preventDefault();

            var popup = new dialog(self.formName, settings.form.$form.show());
            /// popup 창 초기화

            if(self.hasOwnProperty("initDropdown")){
                /// form 에서 dropdown 초기화
                self.initDropdown(self);
            }
            if(self.hasOwnProperty("more")){
                  //// form 에서 추가로 설정해야 되는 form을 정의 해놈
                  var more = self.more;
                 (function() {
                  this.$moreForm.hide();
                  this.$less.hide();

                  /// more 버튼 클릭 후
                  this.$more.click((e)=>{
                    this.$moreForm.show();   //// 추가 form 보임
                    this.$more.hide();  //// more 버튼 사라짐
                    this.$less.show();  /// less  버튼 보임
                  });

                  /// less 버튼 클릭 후
                  this.$less.click((e)=>{
                    this.$moreForm.hide(); //// 추가 form 사라짐
                    this.$more.show(); //// more 버튼 보임
                    this.$less.hide();  /// less  버튼 사라짐
                  });
                }).call(more);
            }

            /// pop 창 버튼 추가
            popup.appendButton('Create', 'btn-primary create',
                  function(dialogItself){

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
                        console.log("called callback");
                        client.sendEventTable(self.formEvent, settings.mainTable, opts, self.callback);
                      }else {
                        console.log("called");
                        client.sendEventTable(self.formEvent, settings.mainTable, opts);
                      }
                    }else {
                      console.log("more value");
                    }

            });
            //
            popup.show();
            //
          });
        },
        /** @method  - initUpdate
         *  @description update Form 초기화
         */
        initUpdate : function (){
          var self = settings.form.update;

          var clone = settings.form.$form.clone().attr("id", "updateForm"); /// 기존 form에서 복사

          function setNewId(i, element ){   //// form 내부 element id 새로 부여
            var originId = $(element).attr("id");
            if(originId !== null && originId !== undefined){
              $(element).attr("id", originId + "New");
            }
          }
          var input = clone.find("input");  ///  update form 내 input 요소 찾기
          var button = (clone.find("button")); /// update form 내 button 요소 찾기
          var div = (clone.find("div")); /// update form 내 div 요소 찾기
          input.each(setNewId); //// form 내부 input id 새로 부여
          button.each(setNewId); //// form 내부 button id 새로 부여
          div.each(setNewId); //// form 내부 div id 새로 부여

          clone.append($("<button/>").addClass("btn btn-default").attr({
              "id" : "update",
              "type" : "button"
            }).text("Update"));
          self.$form.append(clone);

          settings.mainTable.$table.on('click-row.bs.table', function (e, row, $element, field){
            //// 메인 테이블 row 클릭 시

            clone.show();  /// update From 생긴 후

            self.initUpdateForm(self, row, client); /// data form 초기화
            // initPortLists();
            // initPortLists(self.$labellists, self.labellists, self.$labelAdd,  $dataLists  );

          });
        },
        /** @method  - connectDocker
         *  @description docker host 연결 기능
         */
        connectDocker : function(){
          var self = settings.connect;
          self.$connectMenu = $("#connectMenu"); /// docker 연결가능한 호스트 목록
          self.$connectDropDown = $("#connectDropDown"); /// dropdown button
          self.$whoisConnected = $(".whoisConnected"); /// docker가 누구랑 연결되어 있는지 표시창
          self.$connectButton = $(".connectButton"); /// docker connect Event 버튼
          self.$status = $(".status"); /// docker connect 상태 창

          const JSONURL = '/myapp/settings/data.json';
          const ATTR = "ip";
          /// dropdown button 초기화
          initDropdown(JSONURL, self.$connectMenu, self.$connectDropDown, {attr : ATTR});

         client.sendEvent(COMPLETE.NOT, "GetThisDocker", {"docker" : self.dockerinfo}, (data)=>{
              self.$whoisConnected.text(data);
         });
         const  timeInterval = 120000;  // 2ms 120000
         dockerHeathCheck (self, timeInterval);
         function dockerHeathCheck (self, timeInterval){  /// docker heath check
           setInterval(
             ()=>{
               const OPTS = {
                 "ip" : self.$whoisConnected.text(),
                 "docker" : self.dockerinfo
               }
               client.sendEvent(COMPLETE.NOT, "IsConnected",  OPTS, (state)=>{
                 var msg = null;
                 if(state){
                   msg = "Connected";
                 }else {
                   msg = "Disconnected";
                 }
                 self.$status.text(msg);
               });
             }
             , timeInterval);
         }

        self.$connectButton.click((e)=>{
            //  e.preventDefault();
             const hostIP = self.$connectDropDown.text().trim();
             const CONNECTDOCKER = "ConnectDocker";  /// socket 이벤트 명
             const DEFAULTMSG = "Connect Docker"; /// connect button dropDown 기본 값
             if(hostIP === DEFAULTMSG){
                 return false;
             }

             const OPTS = {
                 "ip" : hostIP,
                 "docker" : self.dockerinfo
             } //// docker connection 정보 json
              if(settings.hasOwnProperty("mainTable")){

                 client.sendEventTable(CONNECTDOCKER, settings.mainTable, OPTS, (state)=>{
                   var msg = null;
                   if(state.err){
                     msg = "Disconnected";
                   }else {
                     msg = "Connected";
                   }
                   settings.connect.$status.text(msg);
                 });

               }else {

                 client.sendEvent(COMPLETE.NOT ,CONNECTDOCKER,  OPTS, (data)=>{
                   console.log(hostIP);
                   self.$whoisConnected.text(hostIP);
                   console.log(data);});
                //  console.log(self.$whoisConnected.text());


               }
         });
       },
       /** @method  - initPortLists
        *  @description form 에서 port 정보 추기 및 삭제 기능
        */
       initPortLists : function(){
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
        socketButtonEvent : function (){
          var self = settings;

          for (var i in self.event) {
            /// button event를 loop로 초기화
            // console.log(self.event[i]);
            // console.log(self.event[i].eventName);
            self.event[i].$button.click(
              self.event[i].clickEvent(client, self.event[i].eventName, self.mainTable) /// clickEvent 클로저
            );
          }
        }


    }

})();

module.exports = main;
