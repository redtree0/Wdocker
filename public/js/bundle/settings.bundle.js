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
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {


var dialog = (function dialog(title, message, $body){
  this.title = title;
  this.message = message;
  this.button =  [{
        label: 'Close'
        ,
        action: function(dialogItself){
          dialogItself.close();
        }
   }];
  this.$body = $body;
  this.dialogInstance = null;
});

function makeBootstrapDialog(title, message, button){
  return new BootstrapDialog({
    title: title,
    message: message,
    buttons: button,
    autodestroy : false
  });
};

dialog.prototype.show = function () {
  // console.log();
    this.dialogInstance = makeBootstrapDialog(
      this.title,
      this.message,
      this.button
    );

    (this.dialogInstance).open();
};

dialog.prototype.close = function (timeout) {
    var diaglogInstance = (this.dialogInstance);
    var $body = (this.$body);

    $body.spinStop();
    diaglogInstance.getModalBody().html('Dialog closes in 5 seconds.');
    setTimeout(function(){
              diaglogInstance.close();
    }, timeout);
};

dialog.prototype.setDefaultButton= function(label, className) {

  var enterKey = 13;
  this.button = [{
       label: label,
       cssClass: className,
       hotkey: enterKey
       ,
       action:  function(dialogItself){
         dialogItself.close();
       }
   }];

};

dialog.prototype.appendButton = function(label, className, fn) {

  var button = {
       label: label,
       cssClass: className,
       action: fn
   }

   this.button.unshift(button)
};


module.exports = dialog;


/***/ }),
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


/***/ }),
/* 2 */
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
/* 3 */
/***/ (function(module, exports) {


var config = (function(){
  var container = {
        "Image" : "",
        "name" : "",
        "AttachStdin": false,
        "AttachStdout": true,
        "AttachStderr": true,
        "ExposedPorts": { },
        "Tty": false,
        "Cmd": [  ],
        "OpenStdin": true,
        "StdinOnce": true,
         "HostConfig" : {
          //  "Binds" : [], /// volume-name:container-dest
          "Mounts" :[
          //   {
          //     "target" : "",  // container Path
          //     "Source" : "", // volume_name
          //     "Type" : "" // volume
          // }
        ],
           "LogConfig": {
                "Type": "json-file",
                "Config": {
                    "max-size": "10m"
                 }
                },
           "PortBindings" : {}
         }
  };

  var getContainer = function() {
    return container;
  };

  var setContainer = function (filter, portArray){

    var opts = container;
    opts.Image = filter.Image;
    opts.name = filter.name;
    opts.Cmd = [ filter.Cmd];
    if(filter.hasOwnProperty("volume") && filter.hasOwnProperty("containerDest") ){
      console.log("k");
      opts.HostConfig.Mounts = [{
          "target" : filter.containerDest,
          "Source" : filter.volume,
          "Type" : "volume"
      }];
    }
    console.log(opts);


    for ( var i in portArray) {
      var portinfo = portArray[i].containerPort +"/"+ portArray[i].protocol;
      opts.ExposedPorts[portinfo] = {};
        opts.HostConfig.PortBindings[portinfo] = [{ "HostPort" : portArray[i].hostPort}];
    }

  };

  var network = {
          "Name" : "" ,
          "Driver": "" ,
          "Internal": false,
          "Ingress" : false,
          "Attachable" : false,
          "IPAM" : {
            "Config": [
                  {
                      // "Subnet" : "",
                      // "IPRange" : "",
                      // "Gateway" : ""
                  }
                ]
                ,
                "Options" : {
                  // "parent" : "wlan0"
                }
              },
          "Options": {
                    "com.docker.network.bridge.default_bridge": "false",
                    "com.docker.network.bridge.enable_icc": "true",
                    "com.docker.network.bridge.enable_ip_masquerade": "true",
                    // "com.docker.network.bridge.host_binding_ipv4": "192.168.0.8",
                    // "com.docker.network.bridge.name": "k",
                    "com.docker.network.driver.mtu": "1500"
                  }
        };

  var getNetwork = function() {
    return network;
  }

  var setNetwork = function(filter) {
    var opts = network;
    opts.Name = filter.Name;
    opts.Driver = filter.Driver;
    opts.internal = filter.internal;
    opts.IPAM.Config = [{
      "Subnet" : filter.subnet,
      "IPRange" : filter.ipRange,
      "Gateway" : filter.gateway
    }]
  }

  var image = {
          "term" : "",
          "limit" : "",
          "filters" : {
            "is-automated" : [],
            "is-official": [],
            "stars" : ["0"]
          }
  };

  var getImage = function(){
    return image;
  };

  var setImage = function(filter){
    var opts = image;
    opts.term = filter.term;
    opts.limit = filter.limit;
    opts.filters["is-automated"] = [filter["is-automated"]];
    opts.filters["is-official"] = [filter["is-official"]];
    if(filter.stars) {
      opts.filters["stars"] = filter.stars;
    }
  };

  var volume = {
    "Name" : "",
    "Driver" : ""
    // , "DriverOpts"  : ""
  };

  var getVolume = function(){
    return volume;
  }
  var setVolume = function (filter){
    var opts = volume;
    opts.Name = filter.Name;
    opts.Driver = filter.Driver;
  }

  var service = {
          "Name" : "",
          "TaskTemplate" : {
            "ContainerSpec" : {
              "Image" : "",
              "Command" : []
              // ,"HealthCheck" : {
              //   "Test" : ["NONE"]
              //   // ,
              //   // "Interval" : 30000000 ,
              //   // "Timeout" : 300000000 , //  1000000 = 1ms
              //   // "Retries" : 3,
              //   // "StartPeriod" : 10000000
              // }
            } ,
             "Resources": {
            "Limits": {},
            "Reservations": {}
            },
             "RestartPolicy": {},
                "Placement": {},
                "Networks" : []
          },
          "Mode": {
              "Replicated": {
                "Replicas": 1
              }
          },
          // "UpdateConfig": {
          //       "Parallelism": 2,
          //       "Delay": 1000000000,
          //       "FailureAction": "pause",
          //       "Monitor": 15000000000,
          //       "MaxFailureRatio": 0.15
          // },
          // "RollbackConfig": {
          //       "Parallelism": 1,
          //       "Delay": 1000000000,
          //       "FailureAction": "pause",
          //       "Monitor": 15000000000,
          //       "MaxFailureRatio": 0.15
          // },
          "EndpointSpec": {
                "Ports": [
                      // {
                      // "Protocol": "tcp",
                      // "PublishedPort": null,
                      // "TargetPort": null
                      // }
                  ]
            }
    };


    var getService = function(){
      console.log("getService");
      console.log(service);

      return service;
    };

    var setService = function (filter, portlists){
      var opts = service;
      opts.Name = filter.Name;
      opts.TaskTemplate.ContainerSpec.Image = filter.Image;
      opts.TaskTemplate.ContainerSpec.Command = [filter.Command];
      console.log(filter.Replicas);
      opts.Mode.Replicated.Replicas = filter.Replicas;
      opts.TaskTemplate.Networks = [ {"Target" : filter.Network }] ;

      for ( var i in portlists) {
        var portinfo = {
          "Protocol": portlists[i].protocol,
          "PublishedPort": parseInt(portlists[i].hostPort),
          "TargetPort": parseInt(portlists[i].containerPort)
        }
        opts.EndpointSpec.Ports.push(portinfo);
      }
      service = opts;
      console.log("setService");
      console.log(opts);
    };


  return {
    getContainer : getContainer,
    setContainer: setContainer,
    getNetwork : getNetwork,
    setNetwork : setNetwork,
    getImage : getImage,
    setImage : setImage,
    getVolume : getVolume,
    setVolume : setVolume,
    getService : getService,
    setService : setService
  };

})();




module.exports = config;


/***/ }),
/* 4 */
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


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var table = (function Table($table, columns){
  this.$table = $table;
  this.columns = columns;
  this.opts = {
    columns : this.columns, /// 테이블 컬럼 json
    silent: true,
    search : true, /// 테이블 검색 기능 활성화
    detailView : false, /// 테이블 ExpandRow 활성화
    pageSize : 5, /// 테이블 Row 최대 수
    showRefresh : true, /// 테이블 갱신 버튼 활성화
    showColumns : true /// 테이블 컬럼 Custom 활성화
  };
  // this.checkedRowLists = new Array();
  this.checkedRowLists = []; /// 테이블 체크 박스한 Row 저장
  $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales['ko-KR']); /// 한국어 설정
});

(function(){
  /** @method  - initUrlTable
   *  @description 객체 정보를 기반으로 필요한 기능 초기화
   *  @param {String} urljson - json을 GET할 URL
   *  @param {Function} detailformat - 사용자 정의 객체
   *  @param {Function} callback - 콜백 함수
   *  @return {Function} callback - callback
   */
  this.initUrlTable = function (urljson, detailformat, callback) {

    var init = this.opts;
    init.url = urljson;
    if(typeof detailformat === "function" || detailformat === true) {
      init.detailView = true;
      init.detailFormatter = detailformat;
    }
    (this.$table).bootstrapTable(init);  // 테이블 초기화
    return callback;
  }

  /** @method  - initDataTable
   *  @description json 데이터로 테이블 초기화
   *  @param {String} json - json
   */
  this.initDataTable = function (json) {

    var init = this.opts;
    init.data = json;
    init.detailView = false;
    init.search = false;
    (this.$table).bootstrapTable(init);
  }

  /** @method  - reset
   *  @description 테이블 RESET
   */
  this.reset = function () {
    (this.$table).bootstrapTable('removeAll'); /// 기존 테이블 ROW 삭제
  }

  /** @method  - reset
   *  @description 테이블 RELOAD
   */
  this.reload = function () {
    var self = this;
    if(self.checkedRowLists.length > 0) {
      (self.checkedRowLists).splice(0, (self.checkedRowLists).length);
    }
    const TIMEOUT = 1500;
    setTimeout(()=> {
      (self.$table).bootstrapTable('refresh');  /// 테이블 새로고침
    }, TIMEOUT);
  }

  /** @method  - reset
   *  @description 테이블 data Load
   *  @param {Object} data - 테이블에 갱신할 데이터 json array
   */
  this.load = function (data) {
    (this.$table).bootstrapTable('load', data); /// 테이블 data로 새로 로드
  }

  // /** @method  - clickRow
  //  *  @description 테이블 Row 클릭 후
  //  *  @param {Object} data - 테이블에 갱신할 데이터 json array
  //  */ down grade
  this.clickRow = function ($detail) {
    function addNewRow( _id ){
      return $('<div/>', { class: "row", id : _id });
    }
    function addRowText( _class,  _text){
      return $('<div/>', { class: _class, text: _text });
    }

    (this.$table).on('click-row.bs.table', function (r, e, f){
      var data = e;

      $detail.find("div").remove();
      $.each(data, (key, value)=>{
        if(key == "0") { // key 0 인 값 제외
          return true;
        }
        $detail.append(addRowText("col-md-6", key));
        $detail.append(addRowText("col-md-6", value));
      });

    });
  }


  /** @method  - hideColumns
   *  @description 테이블 컬럼 숨김
   *  @param {Array} fields - 컬럼 Array
   */
  this.hideColumns = function (fields) {
    for(var i in fields) {  /// 숨기는 컬럼 목록으로 루프 돔
      (this.$table).bootstrapTable("hideColumn", fields[i]);  // 컬럼 숨김
    }
  }
  /** @method  - doubleClickRow
   *  @description 테이블 Row 더블 클릭 했을 때 check box 체크 및 해제 하기
   */
  this.doubleClickRow = function () {
    (this.$table).on('dbl-click-row.bs.table', function (e, row, $element, field) { /// 테이블 ROW 더블 클릭 했을때
      if (e.target.type !== 'checkbox') {  /// check box가 아니면
        $(':checkbox', $element).trigger('click'); /// check box 체크 함
      }
    });
  }
  /** @method  - checkAllRow
   *  @description 테이블 check box 전부 선택
   */
  this.checkAllRow = function () {
    var checkedRowLists = this.checkedRowLists;

    (this.$table).on('check-all.bs.table', function (e, row, $element, field) { /// 테이블 check box 전부 선택 했을 때
      row.forEach((data, index, array) => {
        if(checkedRowLists.includes(array[index])){ /// check 한 값이 checkedRowLists에 있으면  안 넣음
        }else {
          checkedRowLists.push(data);
        }
      });

    });
    this.checkedRowLists = checkedRowLists;
  }
  /** @method  - uncheckAllRow
   *  @description 테이블 check box 전부 해제
   */
  this.uncheckAllRow = function () {
    var checkedRowLists = this.checkedRowLists;

    (this.$table).on('uncheck-all.bs.table', function (e, row, $element, field) {  /// 테이블 check box 전부 해제 했을 때

      row.forEach((data) => {  /// row 갯수 만큼
        checkedRowLists.pop(data);  /// data pop 함
      });

    });
    this.checkedRowLists = checkedRowLists;
  }

  /** @method  - checkOneRow
   *  @description 테이블 check box 선택
   */
  this.checkOneRow = function () {
    var self = this;
    var checkedRowLists = self.checkedRowLists;
    (self.$table).on('check.bs.table', function (e, row) {  /// 테이블 한 Row check box 선택 시
      checkedRowLists.push(row); // 데이터 넣음
    });
    self.checkedRowLists = checkedRowLists;
  }

  /** @method  - uncheckOneRow
   *  @description 테이블 check box 해제
   */
  this.uncheckOneRow = function () {
    var checkedRowLists = this.checkedRowLists;

    (this.$table).on('uncheck.bs.table', function (e, row) { /// 테이블 한 Row check box 해제 시
      checkedRowLists.forEach((d, index, object) => {
        if( (row.Id == d.Id) ) { /// 선택 해제한 것의 row id와 checkedRowLists 내에 같은 요소가 있을 경우
          object.splice(index, 1);  /// 제거
        }
      });
    });
    this.checkedRowLists = checkedRowLists;
  }

  /** @method  - checkAllEvents
   *  @description 테이블 check box Event 전부
   */
  this.checkAllEvents = function () {
    this.checkAllRow();
    this.uncheckAllRow();
    this.checkOneRow();
    this.uncheckOneRow();
    this.doubleClickRow();
  }

  /** @method  - clickRowAddColor
   *  @description 테이블 Row 클릭 시 색깔 추가
   *  @param {String} color - color Class
   */
  this.clickRowAddColor = function(color) {
    var $table = this.$table;
    $table.on('click-row.bs.table', function (e, row, $element, field){ /// 테이블 Row  클릭 시
      $table.find("tr").removeClass(color); /// 기존 색깔 제거
      if(!$($element).hasClass(color)){
        $($element).addClass(color); /// 색깔 추가
      }
    });
  }

  /** @method  - expandRow
   *  @description 테이블 Row 클릭 시 색깔 추가
   *  @param {Array} info -  {url : jsonUrl , keys : jsonKey} 로 구성된 배열
   *  @param {Function} callback - 콜백 함수
   */
  this.expandRow = function (info, callback) {
    (this.$table).on("expand-row.bs.table", function (e, index, row, $detail){ /// 테이블 expand 버튼 클릭 시


      /** @method  - expendPromiseData
       *  @description 테이블 Row 클릭 시 색깔 추가
       *  @param {String} url -  json GET할 URL
       *  @param {String} keys -  json Keys
       *  @param {String} rowId -  Row Object 내에  Id 요소
       *  @param {Function} callback - 콜백 함수
       */
      function expendPromiseData (url, keys,  rowId) {
        return new Promise(function(resolve, reject) {  /// getJSON이 비동기라 Promise 이용

          $.getJSON( url + rowId,  {}, function(json, textStatus) { /// url + id로 해당 Id를 지닌 json 얻음
            var data = {};
            for(var i in keys) {
              data[keys[i]] = json[keys[i]];
            }

            var detail = "";
            for(var i in data){
              if(data[i] == undefined || JSON.stringify(data[i])=='{}' || data[i].length == 0) {
              }else {
                detail += "<p> " + i +" : </p><p>" + JSON.stringify(data[i]) + "</p>"; // json 값을 detail에 넣음
              }
            }

            resolve(detail); // 다음 promise로 전달

          });
        });
      }

      var promises = [];
      for (var i in info) {  /// promise 배열 생성
        promises.push(expendPromiseData(info[i].url, info[i].keys,  row.Id));
      }

      Promise.all(promises).then(function(value) {
        $detail.html(value);  /// $detail에 json변환된  $detail내용 넣음
      }, function(reason) {
        $detail.html(reason);  /// $detail에 에러 발생 시  $detail 내용 넣음
      });
    });
  }

}).call(table.prototype);



module.exports = table;

// table.prototype.clickUpdate = function ($detail) {
//     function addNewRow( _id ){
//         return $('<div/>', { class: "row", id : _id });
//     }
//     function addRowText( _class,  _text){
//       return $('<div/>', { class: _class, text: _text });
//     }
//
    // (this.$table).on('click-row.bs.table', function (r, e, f){
    //   var data = e;
    //   for(var i in data){
    //     console.log(i);
    //     console.log(data[i]);
    //     if(typeof data[i] === "object"){
    //
    //       if(data[i].hasOwnProperty("TaskTemplate")){
    //         console.log(data[i].TaskTemplate.ContainerSpec.Command);
    //       }
    //     }
    //   }
//     });
// }


// function checkAddColor($table, item, _class){
//   var rows = $table.bootstrapTable('getData');
//
//   $.getJSON("/myapp/container/data.json", function(json, textStatus) {
//     // console.log("checkAddColor");
//     // console.log(item);
//     var searchNetwork = [];
//     var container = json;
//     container.forEach ( (data) => {
//           var networkSettings = data.NetworkSettings.Networks;
//           for(var network in networkSettings){
//               searchNetwork.push({"name" : data.Names, "networkId" : networkSettings[network].NetworkID});
//             }
//
//     } );
//     // console.log(searchNetwork);
//     $table.find("tr").removeClass(_class);
//     rows.forEach((data)=>{
//       for(var network in searchNetwork){
//         if(item == searchNetwork[network].name ){
//           if (data.Id == searchNetwork[network].networkId) {
//             $table.find("td:contains("+ data.Id + ")").parent().addClass(_class);
//           }
//         }
//       }
//     });
//
//
//   });
// }


// function TestTable($table, json) {
//   var $table = $("#" + $table);
//   console.log(json);
//   getcolumns(json,  (json, list)=>{
//     //console.log(data);
//     console.log($table.attr('id'));
//     //console.log(json);
//     //console.log(JSON.stringify(list));
//     $table.bootstrapTable({
//         url: json,
//         columns: list,
//         search : true
//     });
//
//   });
// }
//
// function getcolumns(json, callback){
//   //console.log(json);
//   $.getJSON( json ,(data) => {
//   var list = [];
//     var col = Object.keys(data[0]);
//     $.each(col, (key, val) => {
//       list[key] = {field : val,  title : val };
//     });
//     //console.log(typeof list);
//     callback(json, list);
//   });
// }


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// web cilent 기능 함축 클로저
var main = (function(){
    var settings = {};
    var socket = io();
    var Socket = __webpack_require__(1);
    var client = new Socket(socket, $('body'));
    var spin = __webpack_require__(2);
    var table = __webpack_require__(5);
    var dialog = __webpack_require__(0);



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
            }


            /// connect 초기화
            if(settings.hasOwnProperty("connect")){
              self.connectDocker();
            }

            if(typeof callback === "function"){
              return callback;
            }
            // self.buttonEvent();
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
          if(settings.hasOwnProperty("event")){
            /// button click event 후 socket event 실행 기능
            self.socketButtonEvent();
          }
          if(settings.form.hasOwnProperty("update")){
            /// update form 초기화
                self.initUpdate();
          }
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

            var popup = new dialog(self.formName, settings.form.$form.show(), settings.$body);
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

                    function setSettings (json, portArray){
                      var config = __webpack_require__(3);
                      var self = settings.form.settingMethod;
                      config[self.set](json, portArray);

                      return  config[self.get]();
                    }
                    // console.log(self.getSettingValue());
                    var opts = setSettings(settings.form.getSettingValue(self), self.portlists); /// docker 데이터 설정

                    if(settings.checkValue(opts)){ /// opts 값 null, undefind , "" 존재 확인
                      if( self.hasOwnProperty("completeEvent") ){
                        client.completeEvent = self.completeEvent;
                      }
                      if( self.hasOwnProperty("dropDown") ){
                        /// form 내에 dropDown 초기화
                         (function(){
                           settings.clickDropdown(this.$dropDown, this.default);
                         }).call(self.dropDown);
                      }
                      if( self.hasOwnProperty("callback") ){
                        client.sendEventTable(self.formEvent, settings.mainTable, opts, self.callback);
                      }else {
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
            $(element).attr("id", originId + "New");
          }
          var input = clone.find("input");  ///  update form 내 input 요소 찾기
          var button = (clone.find("button")); /// update form 내 button 요소 찾기
          var div = (clone.find("div")); /// update form 내 div 요소 찾기
          input.each(setNewId); //// form 내부 input id 새로 부여
          button.each(setNewId); //// form 내부 button id 새로 부여
          div.each(setNewId); //// form 내부 div id 새로 부여

          clone.append($("<button/>").addClass("btn btn-primary").attr("id", "update").text("Update"));
          self.$form.append(clone);

          settings.mainTable.$table.on('click-row.bs.table', function (e, row, $element, field){
            //// 메인 테이블 row 클릭 시

            clone.show();  /// update From 생긴 후

            self.initForm(self, row); /// data form 초기화

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

         client.sendEvent("GetThisDocker", {"docker" : self.dockerinfo}, (data)=>{
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
               client.sendEvent("IsConnected",  OPTS, (state)=>{
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

                 client.sendEvent(CONNECTDOCKER,  OPTS, (data)=>{console.log(data);});
                 self.$whoisConnected.text(hostIP);

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
       /** @method  - socketButtonEvent
        *  @description 버튼 클릭시 발생하는 소켓 이벤트 초기화
        */
        socketButtonEvent : function (){
          var self = settings;

          for (var i in self.event) {
            /// button event를 loop로 초기화
            // console.log(self.event[i]);
            self.event[i].$button.click(
              self.event[i].clickEvent(client, self.event[i].eventName, self.mainTable) /// clickEvent 클로저
            );
          }
        }


    }

})();

module.exports = main;


/***/ }),
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const columns = [{
      field: 'ip',
      title: 'IP',
      sortable : true,
      halign : "center",
      align : "center"
  }, {
      field: 'port',
      title: 'Port',
      sortable : true,
      halign : "center",
      align : "center"
  }
  , {
    field: 'PING',
    title: 'PING',
    halign : "center",
    align : "center",
    width : "5%",
    formatter : function (value , row, index){
      return "<button type='button' class='btn btn-success ping'>PING</button>"
    }
  } , {
      field: 'remove',
      title: '',
      halign : "center",
      align : "center",
      width : "5%",
      formatter : function (value , row, index){
        return "<button type='button' class='btn btn-danger remove'><span class='glyphicon glyphicon-remove'></span></button>"
      }
    }];


$(function(){

      $('.ip_address').mask('0ZZ.0ZZ.0ZZ.0ZZ', { translation: { 'Z': { pattern: /[0-9]/, optional: true } } });
      var $all = {};
      $all.init = function(){
            $.getJSON("/myapp/auth/data.json",(data)=>{
              $("#user").val(data[0].user);
              $("#password").val(data[0].password);
              $("#email").val(data[0].email);
            });
      };
      // $all.form = {};
      $all.table = {};
      $all.table.main = {
        $table : $(".jsonTable"),
        columns : columns,
        jsonUrl : '/myapp/settings/data.json',
        isExpend : false,
        clickRow : function  (e, row, $element, field) {
          var dialog = __webpack_require__(0);
          var socket = io();
          var Socket = __webpack_require__(1);
          var client = new Socket(socket, $('body'));

            if(field === "PING"){
                var opts = {
                  host : row.ip,
                  port : row.port,
                }
              client.sendEvent("PING", opts,(data)=>{
                var finished = null;
                if(data.err) {
                  finished = new dialog("PING ERROR",  data.err.code, $("body"));
                } else {
                  finished = new dialog("PING OK",  data.data, $("body"));
                }
                finished.setDefaultButton('Close[Enker]', 'btn-primary create');
                finished.show();
                finished.close(5000);
              });
            }else if(field === "remove"){
              var opts = {
                _id : row._id,
              }
              client.sendEventTable("DELETE", $(".jsonTable"), opts, (data)=>{
                var finished = new dialog("삭제", data, $("body"));
                finished.setDefaultButton('Close[Enker]', 'btn-primary create');
                finished.show();
              });
            }
          }
        };

      $all.event = {};
      function clickDefault(client, eventName, table){
        return function(){
          client.sendEventTable(eventName, table);
        };
      }
      $all.event.remove = {
          $button : $(".remove"),
          eventName : "DELETE",
          clickEvent : clickDefault
      };
      var main = __webpack_require__(6);
      main.init($all);

      var client = main.getSocket();
      var dialog = main.getDialog();
      $("#authCheck").click((e)=>{
        var opts = {
          user : $("#user").val(),
          password : $("#password").val()
        }
          client.sendEvent("authCheck", opts, (err, data)=>{
            var finished = new dialog("작업 완료",  data.Status + data.err, $("body"));
            finished.show();
          });
      });

});


/***/ })
/******/ ]);