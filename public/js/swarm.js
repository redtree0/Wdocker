var socket = io();

$(function(){

  $('.ip_address').mask('0ZZ.0ZZ.0ZZ.0ZZ', { translation: { 'Z': { pattern: /[0-9]/, optional: true } } });


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


  $("#sshConnection").submit((e)=>{
    e.preventDefault();
    var $ip = $("#hostip");
    var $port = $("#port");
    var $user = $("#user");
    var $passwd = $("#passwd");

    console.log($ip);
     var _ip = $ip.val();
    var _port = $port.val();
    var _user = $user.val();
    var _passwd = $passwd.val();
    console.log($ip.masked());
    alert($ip.masked());
    var opts = {
      host : _ip,
      port : _port,
      user : _user
    };
    if(_passwd) {
      opts.pass = _passwd;
    }

    socket.emit("sshConnection" , opts);
  });
});
