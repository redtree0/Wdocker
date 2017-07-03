var socket = io();

$(function(){



  $("#swarmInit").submit(()=>{
    var $ip = $("#ip").val();

    socket.emit("swarmInit" ,$ip);
    console.log($ip);
  });

  $("#Access").submit(()=>{
    var $accessip = $("#accessip").val();
    
    socket.emit("Access" ,$accessip);
    console.log($ip);
  });
});
