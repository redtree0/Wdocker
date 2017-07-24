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


/***/ })
/******/ ]);