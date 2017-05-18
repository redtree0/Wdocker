$(function(){
  // socket.io 서버에 접속한다
  var socket = io();

  // 서버로 자신의 정보를 전송한다.
  socket.emit("login", {
    // name: "ungmo2",
    name: makeRandomName(),
    userid: "test"
  });

  // 서버로부터의 메시지가 수신되면
  socket.on("login", function(data) {
    $("#chatLogs").append("<div><strong>" + data + "</strong> has joined</div>");
  });

  // 서버로부터의 메시지가 수신되면
  socket.on("chat", function(data) {
  //  console.log(data);
    $("#chatLogs").append("<div>" + data.msg + " : from <strong>" + data.from.name + "</strong></div>");
  //  $("#chatLogs").append("<div>" + data + " : from <strong>" + "</strong></div>");
  });

  // Send 버튼이 클릭되면
  $("#CreateContainer").submit(function(e) {
    e.preventDefault();
    var $msgForm = $("#msgForm");
    var tmp = {
      Image: 'izone/arm:jessie-slim',
      name : $msgForm.val(),
      AttachStdin: false,
      AttachStdout: true,
      AttachStderr: true,
      Tty: true,
      Cmd: ['/bin/bash' ],
      OpenStdin: true,
      StdinOnce: false
    }
    // 서버로 메시지를 전송한다.
    socket.emit("chat", tmp);
    $msgForm.val("");
  });


  function makeRandomName(){
    var name = "";
    var possible = "abcdefghijklmnopqrstuvwxyz";
    for( var i = 0; i < 3; i++ ) {
      name += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return name;
  }
});
