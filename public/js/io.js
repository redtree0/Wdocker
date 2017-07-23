
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
