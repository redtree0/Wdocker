// network.js
"use strict";

var columns = [{
      checkbox: true,
      title: 'Check'
  },{
      field: 'Name',
      title: 'Name'
  },{
      field: 'Created',
      title: 'Created'
  },{
      field: 'Scope',
      title: 'Scope'
  },{
      field: 'Driver',
      title: 'Driver'
  },{
      field: 'EnableIPv6',
      title: 'EnableIPv6'
  },{
      field: 'IPAM',
      title: 'IPAM'
  },{
      field: 'Internal',
      title: 'Internal'
  },{
      field: 'Attachable',
      title: 'Attachable'
  },{
      field: 'Containers',
      title: 'Containers'
  },{
      field: 'Options',
      title: 'Options'
  },{
      field: 'Labels',
      title: 'Labels'
  }];

$(function(){
  initUrlTable("networklist", columns, "/myapp/network/data.json");


});
