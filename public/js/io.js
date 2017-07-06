
  // socket.io 서버에 접속한다
  var socket = io();

  // 서버로 자신의 정보를 전송한다.
  socket.emit("login", {
    // name: "ungmo2",
    name: "my",
    userid: "test"
  });



  function doneCatch(socket, callback){
    socket.on("doneCatch", (data)=>{
      if(data){
          alert("done");
          callback();
          return true;
      }
    });
  }

  function socketErrorCatch(socket) {
    socket.on("errCatch", (err)=> {
        alert(err.json.message);
    });
  }
