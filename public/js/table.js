'use strict';


function initUrlTable(tableid, columns, urljson) {
  var $table = $("#" + tableid);
  var col = columns;
  console.log("do");
  $table.bootstrapTable({
      url: urljson,
      columns: col,
      silent: true,
      search : true
  });
}

function initDataTable(tableid, columns, datajson) {
  var $table = $("#" + tableid);
  var col = columns;
  console.log("do");
  $table.bootstrapTable({
      data : datajson,
      columns: col,
      silent: true,
      search : true
  });
}

function resetTable(tableid){
  var $table = $("#" + tableid);
  $table.bootstrapTable('removeAll');
}

function reloadTable(tableid) {
  var $table = $("#" + tableid);
      setTimeout(()=> {
        $table.bootstrapTable('refresh');
    }, 1000);
}
function loadTable(tableid, data) {
  var $table = $("#" + tableid);
  $table.bootstrapTable('load', data);
}
function checkTableEvent(tableid, checklist){
  checkAlltable(tableid, checklist);
  uncheckAlltable(tableid, checklist);
  checkOneTable(tableid, checklist);
  uncheckOneTable(tableid, checklist);
}

function checkAlltable(tableid, checklist){
  var $table = $("#" + tableid);
  $table.on('check-all.bs.table', function (r,e) {
      e.forEach((data) => {
        checklist.push(data);
      });
      console.log(checklist);
  });
}

function uncheckAlltable(tableid, checklist){
  var $table = $("#" + tableid);
  $table.on('uncheck-all.bs.table', function (r,e) {
          e.forEach((data) => {
            checklist.pop(data);
          });
          console.log(checklist);
  });
}

function checkOneTable(tableid, checklist){
  var $table = $("#" + tableid);
  $table.on('check.bs.table	', function (element, row) {
    checklist.push(row);
    });
    console.log("check");
    console.log(checklist);
}
function uncheckOneTable(tableid, checklist){
  var $table = $("#" + tableid);
  $table.on('uncheck.bs.table', function (element, row) {
    checklist.forEach((d, index, object) => {
      if( (row.Id == d.Id) ) {
            object.splice(index, 1);
      }
    });
    console.log("uncheck");
    console.log(checklist);
  });
}

function TestTable(tableid, json) {
  var $table = $("#" + tableid);
  console.log(json);
  getcolumns(json,  (json, list)=>{
    //console.log(data);
    console.log($table.attr('id'));
    console.log(json);
    console.log(JSON.stringify(list));
    $table.bootstrapTable({
        url: json,
        columns: list,
        search : true
    });

  });
}

function getcolumns(json, callback){
  console.log(json);
  $.getJSON( json ,(data) => {
  var list = [];
    var col = Object.keys(data[0]);
    $.each(col, (key, val) => {
      list[key] = {field : val,  title : val };
    });
    console.log(typeof list);
    callback(json, list);
  });
}
