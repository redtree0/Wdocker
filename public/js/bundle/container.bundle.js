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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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
        };

  var getNetwork = function() {
    return network;
  }

  var setNetwork = function(filter) {
    var opts = network;
    opts.Name = filter.Name;
    opts.driver = filter.driver;
    opts.internal = filter.internal;
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
    opts["is-automated"] = filter["is-automated"];
    opts["is-official"] = filter["is-official"];
    opts.stars = filter.stars;
  };

  var service = {
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


  return {
    getContainer : getContainer,
    setContainer: setContainer,
    getNetwork : getNetwork,
    setNetwork : setNetwork,
    getImage : getImage,
    setImage : setImage
  };

})();




module.exports = config;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var table = (function Table($table, columns){
  this.$table = $table;
  this.columns = columns;
  this.opts = {
    columns : this.columns,
    silent: true,
    search : true,
    detailView : true,
    pageSize : 5
  }
  this.checkedRowLists = new Array();
});

table.prototype.initUrlTable = function (urljson, detailformat) {
  function detailFormatter(index, row) {

  }
  var init = this.opts;
  init.url = urljson;
  if(detailformat) {
    init.detailFormatter = detailFormatter
  }

  (this.$table).bootstrapTable(init);
}

table.prototype.initDataTable = function (datajson) {

  var init = this.opts;
  init.data = datajson;
  (this.$table).bootstrapTable(init);
}

table.prototype.reset = function () {
  (this.$table).bootstrapTable('removeAll');
}

table.prototype.reload = function () {
      setTimeout(()=> {
        (this.$table).bootstrapTable('refresh');
    }, 1500);
}

table.prototype.load = function (data) {
  (this.$table).bootstrapTable('load', data);
}

table.prototype.clickRow = function ($detail) {
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

table.prototype.hideColumns = function (fields) {
  for(var i in fields) {
    (this.$table).bootstrapTable("hideColumn", fields[i]);
  }
}

table.prototype.checkAllRow = function () {
  var checkedRowLists = this.checkedRowLists;

  (this.$table).on('check-all.bs.table', function (r,e) {
      e.forEach((data, index, array) => {

        if(checkedRowLists.includes(array[index])){

        }else {
          checkedRowLists.push(data);
        }
      });

  });
  this.checkedRowLists = checkedRowLists;
}

table.prototype.uncheckAllRow = function () {
  var checkedRowLists = this.checkedRowLists;

  (this.$table).on('uncheck-all.bs.table', function (r,e) {

      e.forEach((data) => {
        checkedRowLists.pop(data);

      });

  });
  this.checkedRowLists = checkedRowLists;
}

table.prototype.checkOneRow = function () {
  var checkedRowLists = this.checkedRowLists;
  (this.$table).on('check.bs.table', function (element, row) {
        checkedRowLists.push(row);
    });
    this.checkedRowLists = checkedRowLists;
}

table.prototype.uncheckOneRow = function () {
  var checkedRowLists = this.checkedRowLists;

  (this.$table).on('uncheck.bs.table', function (element, row) {
        checkedRowLists.forEach((d, index, object) => {
          if( (row.Id == d.Id) ) {
                object.splice(index, 1);
          }
        });
    });
    this.checkedRowLists = checkedRowLists;
}

table.prototype.checkAllEvents = function () {
  this.checkAllRow();
  this.uncheckAllRow();
  this.checkOneRow();
  this.uncheckOneRow();
}

table.prototype.clickRowAddColor = function(color) {
  var $table = this.$table;
  $table.on('click-row.bs.table', function (e, row, $element, field){
    $table.find("tr").removeClass(color);
    if(!$($element).hasClass(color)){
      $($element).addClass(color);
    }
  });
}

table.prototype.expandRow = function (info, callback) {
  (this.$table).on("expand-row.bs.table", function (e, index, row, $detail){
    function expendPromiseData (url, row, keys) {
      return new Promise(function(resolve, reject) {
          $.getJSON( url + row.Id,  {}, function(json, textStatus) {
            var data = {};
            for(var i in keys) {
              data[keys[i]] = json[keys[i]];
            }

            var detail = "";
            for(var i in data){
              if(data[i] == undefined || JSON.stringify(data[i])=='{}' || data[i].length == 0) {
              }else {
                detail += "<p> " + i +" : </p><p>" + JSON.stringify(data[i]) + "</p>";
              }
            }
            resolve(detail);

          });
      });
    }

    var promises = [];
    for (var i in info) {
      promises.push(expendPromiseData(info[i].url, row, info[i].keys));
    }
    Promise.all(promises).then(function(value) {
      $detail.html(value);
    }, function(reason) {
      console.log(reason);
    });
  });
}

module.exports = table;

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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// client index.js

var socket = io();

var columns = [{
      checkbox: true,
      title: 'Check'
  },{
      field: 'Id',
      title: '컨테이너 ID'
  }, {
      field: 'Names',
      title: '컨테이너 명',
      sortable : true,
      halign : "center",
      align : "center"
  }, {
      field: 'Image',
      title: '이미지',
      sortable : true,
      halign : "center",
      align : "center"
  }, {
      field: 'ImageID',
      title: '이미지 ID'
  }, {
      field: 'Command',
      title: '실행 명령어',
      sortable : true,
      halign : "center",
      align : "center"
  }, {
      field: 'Created',
      title: '생성일'
  }, {
      field: 'Ports',
      title: 'Ports(hiden)'
  }, {
      field: 'Labels',
      title: '라벨'
  }, {
      field: 'State',
      title: '상태',
      sortable : true,
      halign : "center",
      align : "center"
  }, {
      field: 'Status',
      title: '상황'
  }, {
      field: 'HostConfig',
      title: 'HostConfig(hiden)'
  }, {
      field: 'NetworkingSettings',
      title: 'NetworkingSettings(hiden)'
  }, {
      field: 'Mounts',
      title: 'Mounts(hiden)'
  }];



function containerSettings (image, name, cmd, portArray){
  var config = __webpack_require__(0);
  // var opts = settings.container;
    if(image == "Images"){
      return false;
    }
    if (hasValue(name, cmd)) {
      config.setContainer({"Image" : image, "name" : name, "Cmd" : cmd},
          portArray);
   };
  return  config.getContainer();
}


$(function(){
    var table = __webpack_require__(1);
    var $container = $(".jsonTable");
    var $detail = $(".detail");
    var $list = $(".portlists");
    var portlists= [];

    var containerTable = new table($container, columns);
    function detailFormatter() {

    };
    containerTable.initUrlTable('/myapp/container/data.json', detailFormatter);
    containerTable.hideColumns(["Id", "ImageID", "Ports", "Mounts", "HostConfig", "NetworkingSettings"]);
    containerTable.checkAllEvents();
    containerTable.clickRow($detail);
    containerTable.clickRowAddColor("danger");
     var expandinfo = [{
       url : "/myapp/container/top/",
       keys : ["Titles", "Processes"]
     },{
       url : "/myapp/container/stats/",
       keys : ["id", "name", "memory_stats", "networks", "cpu_stats", "Ports"]
     }];
     containerTable.expandRow(expandinfo);

     var $form = $("#CreateContainer");
     $form.hide();
     clickDeleteList($list, portlists);
  //
    $(".plus").click((e)=>{
      e.preventDefault();
      var $image =$('#image');
      var $name = $("#name");
      var $command = $("#command");

        initDropdown('/myapp/images/data.json', $(".dropdown-menu"), $image, "RepoTags", 0);
        var button = dialogbutton('Create', 'btn-primary create',
                  function(dialogItself){

                      var image = $image.text().trim();
                      var name = $name.val();
                      var cmd = $command.val();
                      var opts = containerSettings(image, name, command, portlists);
                      formAction($("#CreateContainer"), opts, socket,
                      (data)=>  {
                        reloadTable($container);
                        console.log(data);
                        dialogShow("title", data);
                      });
                  }
      );

      dialogShow("컨테이너 생성", $form.show(), button);

    });


  //
  //
    $(".portAdd").click((e)=>{
        e.preventDefault();
        var $protocol = $("#protocol");
        var $containerPort = $("#containerPort");
        var $hostPort = $("#hostPort");

        var $array = [$containerPort, $hostPort, $protocol];
        var state = true;
        for (var i in $array) {
          if(!(hasValue($array[i].val()))){
            state = false;
          }
        }
        if(state) {
          insertArray(portlists, $array);
          createList ( $list, portlists );
        }
    });
  //
  //
  function socketEvent(eventName, checkedRowLists, callback){
    socket.emit(eventName, checkedRowLists, (data)=>{
      checkedRowLists.splice(0,checkedRowLists.length);
      // containerTable.reload();
      //
      //  dialogShow("title", (data.msg)[0].id);
      callback(containerTable, data);
    });
  }

  function completeEvent(table, data){
     table.reload();
     var msg = "id : " + (data.msg)[0].id + "작업 완료";
     dialogShow("컨테이너", msg);
  }

    $(".start").click((e)=>{
      if(hasValue(containerTable.checkedRowLists)){
        socketEvent("StartContainer", containerTable.checkedRowLists, completeEvent);
      }
    });

    $(".stop").click((e)=>{
      if(hasValue(containerTable.checkedRowLists)){
        socketEvent("StopContainer", containerTable.checkedRowLists, completeEvent);
      }
    });

    $(".remove").click((e)=>{
      if(hasValue(containerTable.checkedRowLists)){
        socketEvent("RemoveContainer", containerTable.checkedRowLists, completeEvent);
      }
    });

    $(".kill").click((e)=>{
      if(hasValue(containerTable.checkedRowLists)){
        socketEvent("KillContainer", containerTable.checkedRowLists, completeEvent);
      }
    });

    $(".pause").click((e)=>{
      if(hasValue(containerTable.checkedRowLists)){
        socketEvent("PauseContainer", containerTable.checkedRowLists, completeEvent);
      }
    });

    $(".unpause").click((e)=>{
      if(hasValue(containerTable.checkedRowLists)){
        socketEvent("UnpauseContainer", containerTable.checkedRowLists, completeEvent);
      }
    });


});


/***/ })
/******/ ]);