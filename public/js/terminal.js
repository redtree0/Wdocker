"use strict";
function attachContainer(terminal, socket, check, name ) {
  if(!check) {
    return
  }
  console.log(terminal);
  terminal.push(function(cmd, term) {
    socket.emit('stdin', cmd);
  }, {
    prompt: 'Container :'+ name + '> ',
    name: 'container',
    onExit: (function () {
      // jquery terminal 에서 먼저 exit를 인식해 명령어가 아닌 terminal pop 호출
      // 되기 때문에 명령문으로써 호출 될기 위해 넣음
      socket.emit('stdin', "exit");
    })
    , exit: true
  });
}

function changePrompt(terminal , command, defaultprompt, socket) {
  var prompt = defaultprompt;
  var cmd = $.terminal.parse_command(command);
  //console.log(cmd);

  if(!cmd.name){
    return
  } else if (cmd.name == "docker" && cmd.args[0] == "attach") {
        searchContainerName(cmd.args[1], attachContainer, terminal, socket);
        // terminal.push(function(cmd, term) {
        //   socket.emit('stdin', cmd);
        // }, {
        //   prompt: 'Container :'+ cmd.args[1] + '> ',
        //   name: 'container',
        //   onExit: (function () {
        //     // jquery terminal 에서 먼저 exit를 인식해 명령어가 아닌 terminal pop 호출
        //     // 되기 때문에 명령문으로써 호출 될기 위해 넣음
        //     socket.emit('stdin', "exit");
        //   })
        //   , exit: true
        // });
    }
}

function searchContainerName(container, callback) {
  var org=arguments;
  var json='/myapp/container/data.json';
  $.getJSON(json, function(json, textStatus) {
      var names = [];
      json.data.forEach ( (data) => {
        names.push((data.Names + '').split('/')[1]);
      //  형변환 json stringify 해야되는데 귀찮음
      });
      console.log(names);
      names.forEach( (data) => {
          if( data == container) {
            console.log(org);
            callback(org[2], org[3], true, data);
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

  var socket = io();
  var defaultprompt = 'shell $';
//  console.log($("#terminal"));
  var terminal = $("#terminal").terminal((command, terminal) => {
//    console.log("command");
    socket.emit('stdin', command);

    changePrompt(terminal, command, defaultprompt, socket);

        if (command == 'foo') {
               var history = terminal.history();
               history.disable();
               terminal.push(function(command) {
                   if (command.match(/^(y|yes)$/i)) {
                       terminal.echo('execute your command here');
                       terminal.pop();
                       history.enable();
                   } else if (command.match(/^(n|no)$/i)) {
                       terminal.pop();
                       history.enable();
                   }
               });
             }

             if (command == 'test'){
             terminal.push(function(cmd, term) {
               if (command == 'help') {
                 term.echo('type "ping" it will display "pong"');
               } else if (cmd == 'ping') {
                 term.echo('pong');
               } else {
                 term.echo('unknown command "' + cmd + '"');
               }
             }, {
               prompt: 'test> ',
               name: 'test'});
           }
  }, {
      login : userlogin,
      prompt: defaultprompt,
      greetings: 'Welcome to the web shell',
      history : true
      , exit: true
  //    exit : false
  });
  console.log(terminal);
//   var ctrlDown = false,
//       ctrlKey = 17,
//       cKey = 67,
//       dKey = 68;
//   terminal.keydown((e) => {
//     //    console.log(e);
//         if( e.keyCode == ctrlKey ){
//           ctrlDown = true;
//         }
//         if (ctrlDown && (e.keyCode == cKey) ){
//           console.log("interupt %s , %s", ctrlDown, e.keyCode);
// //          return socket.emit('interrupt', "interrupt");
//         }
//         if (ctrlDown && (e.keyCode == dKey) ){
//           console.log("exit prompt %s , %s", ctrlDown, e.keyCode);
// //          return socket.emit('resume', "resume");
//         }
//
//   }).keyup(function(e) {
//       if (e.keyCode == ctrlKey) ctrlDown = false;
//   });

  $("#eventTest").click((e)=>{
    //  var log = terminal.get_command();
  //  searchContainerName("xx")
    //terminal.clear();
    //terminal.exec("exit");

    //terminal.exec("exit");
    //terminal.autologin("pirate", "some token");

      //console.log(terminal.get_command());
      //console.log(terminal.pop());
  });

  socket.on('stdout', function(data) {
    terminal.echo(String(data));
  });
  socket.on('stderr', function(data) {
    // if(data) {
    //   errExcept = true;
    //     console.log("stderr errExcept");
    //     console.log(errExcept);
    //     changePrompt(terminal , "", defaultprompt, socket, errExcept) ;
    // }
    terminal.error(String(data));
  });
  socket.on('disconnect', function() {
    terminal.disable();
  });
  socket.on('enable', function() {
    terminal.enable();
  });
  socket.on('disable', function(data) {
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


  var ctrlDown = false,
      ctrlKey = 17,
      cKey = 67,
      dKey = 68;
  $(document).keydown((e) => {
        console.log(e.key);
        if( e.keyCode == ctrlKey ){
          ctrlDown = true;
        }
        if (ctrlDown && (e.keyCode == cKey) ){
          console.log("interupt %s , %s", ctrlDown, e.keyCode);
//          return socket.emit('interrupt', "interrupt");
        }
        if (ctrlDown && (e.keyCode == dKey) ){
          console.log("exit document %s , %s", ctrlDown, e.keyCode);
//          return socket.emit('resume', "resume");
        }

  }).keyup(function(e) {
      if (e.keyCode == ctrlKey) ctrlDown = false;
  });
