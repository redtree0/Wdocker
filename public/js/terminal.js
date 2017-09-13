"use strict";


function attachContainer(terminal, client, check, name ) {
  const COMPLETE = {
    DO : true,
    NOT : false
  }

  if(!check) {
    return
  }
  console.log(terminal);
  terminal.push(function(cmd, term) {
    client.sendEvent(COMPLETE.NOT, 'stdin', cmd);
  }, {
    prompt: 'Container :'+ name + '> ',
    name: 'container',
    onExit: (function () {
      // jquery terminal 에서 먼저 exit를 인식해 명령어가 아닌 terminal pop 호출
      // 되기 때문에 명령문으로써 호출 될기 위해 넣음
      client.sendEvent(COMPLETE.NOT,'stdin', "exit");
    })
    , exit: true
  });
}


function searchContainerName(containerName, callback, terminal, client) {
  var json='/myapp/container/data.json';
  var isRunning = false;
  $.getJSON(json, function(json, textStatus) {
      json.forEach ( (data) => {
        var listName = (data.Names + '').split('/')[1];
        if( listName === containerName) {
            if(data.State === "running"){
              isRunning = true;
               callback(terminal, client, isRunning, containerName);
             }
        }
      });
  });
}

function userlogin(name, password, callback){
    if(name == "pirate"){
        callback("some token");
    } else {
        callback(false);
    }
}

$(function() {
  const COMPLETE = {
    DO : true,
    NOT : false
  }

  var socket = io();
  var Socket = require("./module/io");
  var client = new Socket(socket, $('body'));
  var defaultprompt = 'shell $';
//  console.log($("#terminal"));
  var terminal = $("#terminal").terminal((command, terminal) => {

    client.sendEvent(COMPLETE.NOT, 'stdin', command);
    // changePrompt(terminal, command, defaultprompt, client);

    var cmd = $.terminal.parse_command(command);
    //console.log(cmd);

    if (cmd.name == "docker" && cmd.args[0] == "attach") {
          var containerName =  cmd.args[1];
          searchContainerName(containerName, attachContainer, terminal, client);
    }else {
      return ;
    }

  }, {
      login : userlogin,
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
