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
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ({

/***/ 1:
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


/***/ }),

/***/ 13:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function attachContainer(terminal, client, check, name ) {
  if(!check) {
    return
  }
  console.log(terminal);
  terminal.push(function(cmd, term) {
    client.sendEvent('stdin', cmd);
  }, {
    prompt: 'Container :'+ name + '> ',
    name: 'container',
    onExit: (function () {
      // jquery terminal 에서 먼저 exit를 인식해 명령어가 아닌 terminal pop 호출
      // 되기 때문에 명령문으로써 호출 될기 위해 넣음
      client.sendEvent('stdin', "exit");
    })
    , exit: true
  });
}


function searchContainerName(containerName, callback, terminal, client) {
  var json='/myapp/container/data.json';
  var isRunning = false;
  $.getJSON(json, function(json, textStatus) {
      json.forEach ( (data) => {
        var listName = (data.Names + '').split('/')[1];
        if( listName === containerName) {
            if(data.State === "running"){
              isRunning = true;
               callback(terminal, client, isRunning, containerName);
             }
        }
      });
  });
}

function userlogin(name, password, callback){
    if(name == "pirate"){
        callback("some token");
    } else {
        callback(false);
    }
}

$(function() {
  var socket = io();
  var Socket = __webpack_require__(1);
  var client = new Socket(socket, $('body'));
  var spin = __webpack_require__(2);
  var defaultprompt = 'shell $';
//  console.log($("#terminal"));
  var terminal = $("#terminal").terminal((command, terminal) => {

    client.sendEvent('stdin', command);
    // changePrompt(terminal, command, defaultprompt, client);

    var cmd = $.terminal.parse_command(command);
    //console.log(cmd);

    if (cmd.name == "docker" && cmd.args[0] == "attach") {
          var containerName =  cmd.args[1];
          searchContainerName(containerName, attachContainer, terminal, client);
    }else {
      return ;
    }

  }, {
      login : userlogin,
      prompt: defaultprompt,
      greetings: 'Welcome to the web shell!!!',
      history : true,
      exit: true
  });



  client.listen('stdout', function(data) {
    terminal.echo(String(data));
  });
  client.listen('stderr', function(data) {
    terminal.error(String(data));
  });
  client.listen('disconnect', function() {
    terminal.disable();
  });
  client.listen('enable', function() {
    terminal.enable();
  });
  client.listen('disable', function(data) {
    terminal.disable();
  });
});

/// backspace 뒤로가기 막기
$(document).keydown(function(e){
  history.pushState(null, null, location.href);
    window.onpopstate = function(event) {
      history.go(1);
    };
});


/***/ }),

/***/ 2:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) { module.export = $(function(){

   var opts = {
     lines: 10, // The number of lines to draw
     length: 10, // The length of each line
     width: 7, // The line thickness
     radius: 12, // The radius of the inner circle
     color: '#000', // #rgb or #rrggbb
     speed: 1.4, // Rounds per second
     trail: 54, // Afterglow percentage
     shadow: false // Whether to render a shadow
   };

   $.fn.spinStart = function() {
     this.each(function() {
       var $this = $(this), data = $this.data();
       console.log($this);
       console.log(data.spinner);
       if (data.spinner) {
         data.spinner.stop();
         delete data.spinner;
       }
       if (opts !== false) {
         data.spinner = new Spinner($.extend({color: $this.css('color')}, opts)).spin(this);
       }
     });
     return this;
   };

   $.fn.spinStop = function (){
      var $this = $(this), data = $this.data();
      if (data.spinner) {
        data.spinner.stop();
        // $(this).data().spinner.stop();
      }
     // $('#'+id).data('spinner').stop();
   }
 });

// module.export = Spin;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)(module)))

/***/ }),

/***/ 4:
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ })

/******/ });