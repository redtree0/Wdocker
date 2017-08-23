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
/* 0 */
/***/ (function(module, exports) {


var defaultSettings = function() {


this.container = {
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
         "LogConfig": {
              "Type": "json-file",
              "Config": {
                  "max-size": "10m"
               }
              },
         "PortBindings" : {}
       }
};
this.container.setup = function (filter, portArray){
  console.log(filter);




  var config = {
    "Image" : filter.Image,
    "name" : filter.name,
    "AttachStdin": false,
    "AttachStdout": true,
    "AttachStderr": true,
    "ExposedPorts":  {}  ,
    "Tty": false,
    "Cmd": [ filter.Cmd ],
    "OpenStdin": true,
    "StdinOnce": true,
     "HostConfig" : {
       "LogConfig": {
            "Type": "json-file",
            "Config": {
                "max-size": "10m"
             }
            },
       "PortBindings" : {}
     }
  }


    for ( var i in portArray) {
      var portinfo = portArray[i].containerPort +"/"+ portArray[i].protocol;
      config.ExposedPorts[portinfo] = {};
        config.HostConfig.PortBindings[portinfo] = [{ "HostPort" : portArray[i].hostPort}];
    }
  return config;
}
console.log(this.container);
this.network = {
        "Name" : "" ,
        "Driver": "" ,
        "Internal": false,
        "Ingress" : false,
        "Attachable" : false,
        "IPAM" : {
          // "Config": [
          //       {
          //           // "Subnet" : "",
          //           // "IPRange" : "",
          //           // "Gateway" : ""
          //       }
          //     ]
              // ,
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
      }

this.image = {
        "term" : "",
        "limit" : "",
        "filters" : {
          "is-automated" : [],
          "is-official": [],
          "stars" : ["0"]
        }
    };

this.service = {
        "Name" : "",
        "TaskTemplate" : {
          "ContainerSpec" : {
            "Image" : "",
            "Command" : [],
            "HealthCheck" : {
              "Test" : [],
              "Interval" : 30000000 ,
              "Timeout" : 300000000 , //  1000000 = 1ms
              "Retries" : 3,
              "StartPeriod" : 10000000
            }
          }
        },
        "Mode": {
            "Replicated": {
              "Replicas": 4
            }
        },
        "UpdateConfig": {
              "Parallelism": 2,
              "Delay": 1000000000,
              "FailureAction": "pause",
              "Monitor": 15000000000,
              "MaxFailureRatio": 0.15
        },
        "RollbackConfig": {
              "Parallelism": 1,
              "Delay": 1000000000,
              "FailureAction": "pause",
              "Monitor": 15000000000,
              "MaxFailureRatio": 0.15
        },
        "EndpointSpec": {
              "Ports": [
                    {
                    "Protocol": "tcp",
                    "PublishedPort": null,
                    "TargetPort": null
                    }
                ]
          }
  };

}

module.exports = defaultSettings;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {


var socket = __webpack_require__(2);
var defaultSettings = __webpack_require__(0);
console.log(socket);
console.log(defaultSettings.container);
var settings = new defaultSettings();

console.log(settings.container);
// socket.login(io());
// document.write("hello" + ', ' + "world" + '!');
module.exports =  defaultSettings;


/***/ }),
/* 2 */
/***/ (function(module, exports) {


  // socket.io 서버에 접속한다

var socket = function (io) {
  var socket = io;
  return {
    login : function(callback) {
      socket.emit("login", {
        // name: "ungmo2",
        name: "my",
        userid: "test"
      });
      if(typeof callback === "function") {
        callback;
      }
    },

   isFinished : function(callback){
      socket.on("isFinished", (data)=>{
        if(data){
          console.log("isFinished");
        }
        if(typeof callback === "function") {
          callback;
        }
      });
    }

  }
}


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


/***/ })
/******/ ]);