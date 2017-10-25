"use strict";


// 메시지를 전송한 클라이언트를 제외한 모든 클라이언트에게 메시지를 전송한다
//socket.broadcast.emit('chat', msg);

// 메시지를 전송한 클라이언트에게만 메시지를 전송한다
// socket.emit('s2c chat', msg);

// 접속된 모든 클라이언트에게 메시지를 전송한다
// io.emit('s2c chat', msg);

// 특정 클라이언트에게만 메시지를 전송한다
// io.to(id).emit('s2c chat', data);
var serversocket = (function serversocket(socket) {
  this.socket = socket;
});

(function(){
  /** @method  - listen
   *  @description 클라이언트의 데이터 수신 대기
   *  @param {String} eventName - 소켓 이벤트 명
   *  @param {Function} callback - 콜백 함수
   *  @return {Function} callback - callback
   */
  this.listen = function(eventName, callback) {
    var socket =  this.socket;

    ///// socket.on (eventName, callback(data, fn))
    //// eventName 소켓 이벤트 명
    //// callback 데이터 받을 시 실행할 콜백 함수
    //// data 받은 데이터
    //// fn client Callback 함수
    socket.on(eventName, function(data, fn){
      console.log("do listen %s", eventName);
      // console.log("get data %s", data);
      if(typeof fn === "function"){
        // console.log("is called");
        callback(data, fn);
      }else {
        callback(data);
      }
    });

  }
  /** @method  - sendEvent
   *  @description 클라이언트로 데이터 송신
   *  @param {String} eventName - 소켓 이벤트 명
   *  @param {Function} callback - 콜백 함수
   *  @return {Function} callback - callback
   */
  this.sendEvent = function(eventName, data, callback) {
    var socket =  this.socket;

    ///// socket.emit (eventName, data, callback)
    //// eventName 소켓 이벤트 명
    //// data 클라이언트로 보낼 데이터
    //// callback 클라이언트에서 다시 서버로 보낸 데이터를 받은 후 실행할 콜백 함수
    socket.emit(eventName, data, callback);
    console.log("do send %s", eventName);
  }




}).call(serversocket.prototype);


module.exports = serversocket;
