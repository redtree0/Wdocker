"use strict";
  // socket.io 서버에 접속한다

var clientsocket = (function clientsocket(io, $body) {
  this.socket = io;
  this.$body = $body;
  console.log(io);
});

  clientsocket.prototype.login = function(callback) {
    this.socket.emit("login", {
      // name: "ungmo2",
      name: "my",
      userid: "test"
    });
    if(typeof callback === "function") {
      callback;
    }
  };

  clientsocket.prototype.isFinished = function(callback){
    this.socket.on("isFinished", (data)=>{
      if(data){
        console.log("isFinished");
      }
      if(typeof callback === "function") {
        callback;
      }
    });
  };

  clientsocket.prototype.socketTableEvent = function(eventName, opts, callback){
    console.log("socketEvent");
    console.log(arguments);
    var state = null;
    var tmp = null;

    if(arguments.length ===2 ){
      callback = opts;
      opts = null;
    }
    if(opts.hasOwnProperty("container")){
      state = false;
    } else if (opts.hasOwnProperty("table") && opts.hasOwnProperty("lists")){
          state = true;
    }
      var table = opts.table;
      var checkedRowLists = opts.lists;

        console.log("in socket");
          (this.$body).spinStart();
          if(state){
            tmp = opts.lists;
          }else {
            console.log("condition");

            var tmp = opts;
          }
          var socket =  this.socket;
          console.log(tmp);
          delete tmp.table;
          socket.emit(eventName, tmp, (data)=>{
            table.checkedRowLists = [];
            callback(table, data, (this.$body).spinStop());
          });
    };

    clientsocket.prototype.completeEvent = function(){

    };

    clientsocket.prototype.socketEvent = function(eventName, settings, table, callback){
      var socket =  this.socket;
      var $body = this.$body;
      if(arguments.length === 3) {
        callback = table;
        table = null;
      }
      console.log(settings);
      if(!settings) {
        alert("socket Event more need arguments");
      } else {
        $body.spinStart();
        socket.emit(eventName, settings, (data)=>{
          console.log(arguments);
          // callback(table, data, (this.$body).spinStop());
          if(arguments.length === 3){
            callback(data, (this.$body).spinStop());
          }else {
            callback(table, data, (this.$body).spinStop());
          }
        });

      }

    };
      clientsocket.prototype.sendEvent = function (eventName, data) {
        console.log(eventName);
        console.log(data);
        var socket =  this.socket;

        socket.emit(eventName, data);
      };

      clientsocket.prototype.listen = function (eventName, callback) {
        var socket =  this.socket;
        socket.on(eventName, callback);
      };
module.exports = clientsocket;
