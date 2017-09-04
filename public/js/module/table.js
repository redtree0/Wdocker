'use strict';

var table = (function Table($table, columns){
  this.$table = $table;
  this.columns = columns;
  this.opts = {
    columns : this.columns, /// 테이블 컬럼 json
    silentSort : true,
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
        if(value){
          $detail.append(addRowText("col-md-6", value));
        }
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
