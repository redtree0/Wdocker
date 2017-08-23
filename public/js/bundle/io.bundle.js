/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



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
          if(arguments.length === 2) {
              opts = null;
              callback = null;
              data = checkedRowLists;
          } else if( (arguments.length === 3) && (typeof opts === "function") ){
              callback = opts;
              opts = null;
              data = checkedRowLists;
          } else if( (arguments.length === 3) && (typeof opts === "object") ){
              data = opts;
          } else if (arguments.length === 4 ){
              data = opts;
          } else {
              return;
          }

          self.$body.spinStart();  /// spinner 시작
          return self.sendEvent(eventName, data, (data)=>{
            (self.$body).spinStop(); /// spinner 정지
            table.reload();  /// 테이블 갱신
            self.completeEvent(data); /// 소켓 완료 후 실행 함수
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
    this.sendEvent = function (eventName, data, callback) {
        // console.log("do event %s , data %s", eventName, data);

        var socket =  this.socket;
        ///// socket.emit (eventName, data, callback)
        //// eventName 소켓 이벤트 명
        //// data 서버로 보낼 데이터
        //// callback 서버에서 다시 클라이언트로 보낸 데이터를 받은 후 실행할 콜백 함수
        return socket.emit(eventName, data, (data)=>{
             callback(data);
        });
    };

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


/***/ })
/******/ ]);