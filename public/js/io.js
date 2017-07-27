
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

  clientsocket.prototype.socketTableEvent = function(eventName, table, callback){
      var checkedRowLists = table.checkedRowLists;
      if(hasValue(checkedRowLists)){
          var socket =  this.socket;
          (this.$body).spinStart();
          console.log(socket);
          socket.emit(eventName, checkedRowLists, (data)=>{
            table.checkedRowLists.splice(0, checkedRowLists.length);
            callback(table, data, (this.$body).spinStop());
          });
        }
    };

    clientsocket.prototype.completeEvent = function(){

    };


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

module.exports = clientsocket;
