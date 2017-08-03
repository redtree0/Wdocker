"use strict";
  // socket.io 서버에 접속한다

var clientsocket = (function clientsocket(io, $body) {
  this.socket = io;
  this.$body = $body;
});

  clientsocket.prototype.login = function(callback) {
    this.socket.emit("login", {
      // name: "ungmo2",
      name: "my",
      userid: "test"
    });
    if(typeof callback === "function") {
      callback;
    }
  };

  clientsocket.prototype.isFinished = function(callback){
    this.socket.on("isFinished", (data)=>{
      if(data){
        console.log("isFinished");
      }
      if(typeof callback === "function") {
        callback;
      }
    });
  };

  /** @method  - socketTableEvent
   *  @description 소켓
   *  @param {String} eventName - 소켓 이벤트 명
   *  @param {Object} table - 테이블 객체
   *  @param {Object} opts - json data
   *  @param {Function} callback - 콜백 함수
   *  @return {Object} opts -
   */
  clientsocket.prototype.sendEventTable = function(eventName, table, opts, callback){
          var data = null;
          var checkedRowLists = table.checkedRowLists;
          var self = this;

          // (self.$body).spinStart(); /// 화면 로딩 시작
          if(arguments.length === 2) {
            opts = null;
            callback = null;
            data = checkedRowLists;
          } else if( (arguments.length === 3) && (typeof opts === "function") ){
            callback = opts;
            opts = null;
            data = checkedRowLists;
          } else if( (arguments.length === 3) && (typeof opts === "object") ){
            // opts.lists = checkedRowLists;
            data = opts;
          } else if (arguments.length === 4 ){
            data = opts;
          } else {
            return;
          }
          console.log(data);
          self.spinnerEvent(eventName, data, callback);
          table.reload();
    };

    clientsocket.prototype.completeEvent = function(){

    };


    /** @method  - socketTableEvent
     *  @description 소켓 테이블
     *  @param {String} eventName - 소켓 이벤트 명
     *  @param {Object} opts - json data
     *  @param {Function} callback - 콜백 함수
     *  @return {Object} opts -
     */
    clientsocket.prototype.spinnerEvent = function(eventName, opts, callback){
      var self = this;
      var data = null;

      if(arguments.length <= 1) {
        return ;
      } else {
        data = opts;
      }

      if(data) {
        self.$body.spinStart();
        return self.sendEvent(eventName, data, (data)=>{
          self.completeEvent(data);
          (self.$body).spinStop();
          callback;
        });
      }
    };


    clientsocket.prototype.sendEvent = function (eventName, data, callback) {
        console.log("do event %s , data %s", eventName, data);
        var socket =  this.socket;

        return socket.emit(eventName, data, callback);
    };

    clientsocket.prototype.listen = function (eventName, callback) {
        var socket =  this.socket;
        return socket.on(eventName, callback);
    };


module.exports = clientsocket;
