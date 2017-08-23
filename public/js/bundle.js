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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {


var socket = __webpack_require__(1);
console.log(socket);
socket.login(io());
// document.write("hello" + ', ' + "world" + '!');
module.exports = socket;


/***/ }),
/* 1 */
/***/ (function(module, exports) {


  // socket.io 서버에 접속한다

  // var socket = io();


  // 서버로 자신의 정보를 전송한다.
var socket ={
  login : function(socket) {
    socket.emit("login", {
      // name: "ungmo2",
      name: "my",
      userid: "test"
    });

  }
}
  // socket.emit("login", {
  //   // name: "ungmo2",
  //   name: "my",
  //   userid: "test"
  // });


  // function isFinished(callback){
  //   socket.on("isFinished", (data)=>{
  //     if(data){
  //       console.log("isFinished");
  //       if(callback) {
  //         console.log("call");
  //         callback();
  //       }
  //     }
  //   });
  // }
  //
  // function doneCatch(socket, callback){
  //   socket.on("doneCatch", (data)=>{
  //     if(data){
  //       alert("done");
  //       callback();
  //       return true;
  //     }
  //   });
  // }
  //
  // function socketErrorCatch(socket) {
  //   socket.on("errCatch", (err)=> {
  //     alert(err.json.message);
  //   });
  // }

module.exports = socket;
  // module.exports = socket;


/***/ })
/******/ ]);