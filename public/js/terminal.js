"use strict";

$(function() {
  const COMPLETE = {
    DO : true,
    NOT : false
  }

  var main = require("./module/main");
  var client = main.getSocket();
  var defaultprompt = 'shell $';
//  console.log($("#terminal"));
  var terminal = $("#terminal").terminal((command, terminal) => {

    client.sendEvent(COMPLETE.NOT, 'stdin', command);

    var cmd = $.terminal.parse_command(command);


  }, {
      // login : userlogin,
      autologin : true,
      prompt: defaultprompt,
      greetings: 'Welcome to the web shell!!!',
      history : true,
      exit: true
  });



  client.listen('stdout', function(data) {
    terminal.echo(String(data));
  });
  client.listen('stderr', function(data) {
    terminal.error(String(data));
  });
  client.listen('disconnect', function() {
    terminal.disable();
  });
  client.listen('enable', function() {
    terminal.enable();
  });
  client.listen('disable', function(data) {
    terminal.disable();
  });
});

/// backspace 뒤로가기 막기
$(document).keydown(function(e){
  history.pushState(null, null, location.href);
    window.onpopstate = function(event) {
      history.go(1);
    };
});
