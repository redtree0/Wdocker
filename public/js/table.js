'use strict';


function initUrlTable($table, columns, urljson) {
  var col = columns;
//  console.log("do");
  $table.bootstrapTable({
      url: urljson,
      columns: col,
      silent: true,
      search : true
  });
}

function initDataTable($table, columns, datajson) {
  var col = columns;
  //console.log("do");
  $table.bootstrapTable({
      data : datajson,
      columns: col,
      silent: true,
      search : true
  });
}

function resetTable($table){
  $table.bootstrapTable('removeAll');
}

function reloadTable($table) {
      setTimeout(()=> {
        $table.bootstrapTable('refresh');
    }, 1500);
}
function loadTable($table, data) {
  $table.bootstrapTable('load', data);
}
function checkTableEvent($table, checklist){
  checkAlltable($table, checklist);
  uncheckAlltable($table, checklist);
  checkOneTable($table, checklist);
  uncheckOneTable($table, checklist);
}

function clickRowAddColor($table, _class){

  $table.on('click-row.bs.table', function (r, e, f){
    $table.find("tr").removeClass(_class);
    if(!$(f).hasClass(_class)){
      $(f).addClass(_class);
    }
  });
}

function clickTableRow($table, $detail){
  function addNewRow( _id ){
      return $('<div/>', { class: "row", id : _id });
  }
  function addRowText( _class,  _text){
    return $('<div/>', { class: _class, text: _text });
  }

  $table.on('click-row.bs.table', function (r, e, f){
    var data = e;

    $detail.find("div").remove();
    $.each(data, (key, value)=>{
      console.log(key);
      console.log(value);
      if(key == "0") { // key 0 인 값 제외
        return true;
      }
      $detail.append(addRowText("col-md-6", key));
      $detail.append(addRowText("col-md-6", value));
    });

  });
}

function checkAlltable($table, checklist){
  $table.on('check-all.bs.table', function (r,e) {
      e.forEach((data) => {
        checklist.push(data);
      });
      console.log(checklist);
  });
}

function uncheckAlltable($table, checklist){
  $table.on('uncheck-all.bs.table', function (r,e) {
          e.forEach((data) => {
            checklist.pop(data);
          });
      //    console.log(checklist);
  });
}

function checkOneTable($table, checklist){
  $table.on('check.bs.table	', function (element, row) {
    checklist.push(row);
    });
}

function uncheckOneTable($table, checklist){
  $table.on('uncheck.bs.table', function (element, row) {
    checklist.forEach((d, index, object) => {
      if( (row.Id == d.Id) ) {
            object.splice(index, 1);
      }
    });
  });
}
function checkAddColor($table, item, _class){
  var rows = $table.bootstrapTable('getData');

  $.getJSON("/myapp/container/data.json", function(json, textStatus) {
    // console.log("checkAddColor");
    // console.log(item);
    var searchNetwork = [];
    var container = json;
    container.forEach ( (data) => {
          var networkSettings = data.NetworkSettings.Networks;
          for(var network in networkSettings){
              searchNetwork.push({"name" : data.Names, "networkId" : networkSettings[network].NetworkID});
            }

    } );
    // console.log(searchNetwork);
    $table.find("tr").removeClass(_class);
    rows.forEach((data)=>{
      for(var network in searchNetwork){
        if(item == searchNetwork[network].name ){
          if (data.Id == searchNetwork[network].networkId) {
            $table.find("td:contains("+ data.Id + ")").parent().addClass(_class);
          }
        }
      }
    });


  });
}

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
