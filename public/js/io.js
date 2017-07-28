
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

    var state = null;
    if(opts.hasOwnProperty("table") && opts.hasOwnProperty("lists")){
          state = true;
    }else if(opts.hasOwnProperty("container")){
          state = false;
    } else {
      return false;
    }
      var table = opts.table;
      var checkedRowLists = opts.lists;
      if(hasValue(checkedRowLists)){
          var socket =  this.socket;
          (this.$body).spinStart();
          if(state){
            socket.emit(eventName, opts.lists, (data)=>{
              opts.table.checkedRowLists.splice(0, checkedRowLists.length);
              callback(table, data, (this.$body).spinStop());
            });
          }else {
            socket.emit(eventName, opts, (data)=>{
              opts.table.checkedRowLists.splice(0, checkedRowLists.length);
              callback(table, data, (this.$body).spinStop());
            });
          }
        }
    };

    clientsocket.prototype.completeEvent = function(){

    };

    clientsocket.prototype.socketEvent = function(eventName, settings, table, callback){
      var socket =  this.socket;
      var $body = this.$body;
      if(arguments.length === 3) {
        callback = table;
      }
      if(!settings) {
        alert("more need arguments");
      } else {
        $body.spinStart();
        socket.emit(eventName, settings, (data)=>{
          console.log(arguments);
          // callback(table, data, (this.$body).spinStop());
          callback(table, data, (this.$body).spinStop());
        });

      }

    };

module.exports = clientsocket;
