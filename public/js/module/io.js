"use strict";
var spin = require("./spinner");

var clientsocket = (function clientsocket(io, $body) {
  this.socket = io; // client socket 정보
  this.$body = $body; /// spinner 를 위한  $body
});

  // clientsocket.prototype.login = function(callback) {
  //   this.socket.emit("login", {
  //     // name: "ungmo2",
  //     name: "my",
  //     userid: "test"
  //   });
  //   if(typeof callback === "function") {
  //     callback;
  //   }
  // };
  //
  // clientsocket.prototype.isFinished = function(callback){
  //   this.socket.on("isFinished", (data)=>{
  //     if(data){
  //       console.log("isFinished");
  //     }
  //     if(typeof callback === "function") {
  //       callback;
  //     }
  //   });
  // };

(function() {
     /** @method  - socketTableEvent
     *  @description 소켓
     *  @param {String} eventName - 소켓 이벤트 명
     *  @param {Object} table - 테이블 객체
     *  @param {Object} opts - json data
     *  @param {Function} callback - 콜백 함수
     *  @return {Function} this.sendEvent - 소켓 송신 이벤트
     */
   this.sendEventTable = function(eventName, table, opts, callback){
          var self = this;
          var data = null;
          var checkedRowLists = table.checkedRowLists; /// table checked row data

          if(self.$body === null){
            return
          }
          if(table === null){
            return
          }
          if(arguments.length === 2) {
              opts = null;
              callback = null;
              data = checkedRowLists;
          } else if( (arguments.length === 3) && (typeof opts === "function") ){
              callback = opts;
              opts = null;
              data = checkedRowLists;
          }
          else if( (arguments.length === 3) && (typeof opts === "object") ){
              // data = {
              //   "checkedRowLists" : checkedRowLists,
              //   "opts" : opts
              // };
              data = opts;
          }
           else if (arguments.length === 4 ){
              data = opts;
          } else {
              return;
          }
          // console.log(data);
          self.$body.spinStart();  /// spinner 시작
          const DOCOMPLETE = true;
          return self.sendEvent(DOCOMPLETE , eventName, data, (data)=>{
            (self.$body).spinStop(); /// spinner 정지
            if(table){
              table.reload();  /// 테이블 갱신
            }
            if(typeof callback !== undefined && typeof callback === "function") {
              callback(data);
            }
          });


    };

    /// 소켓 완료 후 실행 함수 , 바깥에서 기능에 맞게 Overwrite
    this.completeEvent = function(){

    };

    /** @method  - sendEvent
    *  @description 소켓 데이터 송신 함수
    *  @param {String} eventName - 소켓 이벤트 명
    *  @param {Object} data - json data
    *  @param {Function} callback - 콜백 함수
    *  @return {Function} socket.emit - 소켓 송신
    */
    this.sendEvent = function (doComplete, eventName, data, callback) {
        var self = this;

        console.log("do event %s , data %s", eventName, data);

        var socket =  this.socket;
        self.$body.spinStart();

        ///// socket.emit (eventName, data, callback)
        //// eventName 소켓 이벤트 명
        //// data 서버로 보낼 데이터
        //// callback 서버에서 다시 클라이언트로 보낸 데이터를 받은 후 실행할 콜백 함수
        return socket.emit(eventName, data, (data)=>{
          (self.$body).spinStop(); /// spinner 정지
            if(doComplete){
              self.completeEvent(data); /// 소켓 완료 후 실행 함수
            }
            if(typeof callback === "function"){
              callback(data);
            }
        });
    };


    // /** @method  - onlyEvent
    // *  @description 소켓 데이터 송신 함수
    // *  @param {String} eventName - 소켓 이벤트 명
    // *  @param {Object} data - json data
    // *  @param {Function} callback - 콜백 함수
    // *  @return {Function} socket.emit - 소켓 송신
    // */
    // this.onlySendEvent = function (eventName, data, callback) {
    //     var self = this;
    //
    //     console.log("do event %s , data %s", eventName, data);
    //
    //     var socket =  this.socket;
    //     ///// socket.emit (eventName, data, callback)
    //     //// eventName 소켓 이벤트 명
    //     //// data 서버로 보낼 데이터
    //     //// callback 서버에서 다시 클라이언트로 보낸 데이터를 받은 후 실행할 콜백 함수
    //     return socket.emit(eventName, data, (data)=>{
    //         if(typeof callback === "function"){
    //           callback(data);
    //         }
    //     });
    // };

    /** @method  - listen
    *  @description 소켓 데이터 수신 함수
    *  @param {String} eventName - 소켓 이벤트 명
    *  @param {Function} callback - 콜백 함수
    *  @return {Function} socket.on - 소켓 수신
    */
    this.listen = function (eventName, callback) {
        var socket =  this.socket;
        ///// socket.on (eventName, callback)
        //// eventName 소켓 이벤트 명
        //// callback 데이터 받을 시 실행 콜백 함수
        return socket.on(eventName, callback);
    };
}).call(clientsocket.prototype);


module.exports = clientsocket;
