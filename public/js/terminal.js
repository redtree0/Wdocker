function changePrompt(terminal , command, defaultprompt) {
  var prompt = defaultprompt;
  var arg0 = 0, arg1 = 1, arg2 = 2;
  var cmd = [];

  if (!command){
      return
  } else {
    tmp = command.split(' ');
    tmp.forEach( (data) => {
      cmd.push(data);
    });
  }
  if ( (cmd[arg0] == "docker") && (cmd[arg1] == "attach") ) {
      terminal.set_prompt("Container :"+ cmd[arg2] + '| $');
  } else if (cmd[arg0] == "exit") {
    terminal.set_prompt(prompt);
  }
}

$(function() {
  var socket = io();
  var defaultprompt = 'shell $';
  var terminal = $('#terminal').terminal(function(command, terminal) {
    socket.emit('stdin', command);
    changePrompt(terminal, command, defaultprompt);
  },
  {
      greetings: 'Welcome to the web shell'
    , prompt: defaultprompt
    , exit: false
  });
  console.log(prompt);
  socket.on('stdout', function(data) {
    terminal.echo(String(data));
  });
  socket.on('stderr', function(data) {
    terminal.error(String(data));
  });
  socket.on('disconnect', function() {
    terminal.disable();
  });
  socket.on('enable', function() {
    terminal.enable();
  });
  socket.on('disable', function() {
    terminal.disable();
  });
});

$(document).keydown(function(e){
  history.pushState(null, null, location.href);
    window.onpopstate = function(event) {
      history.go(1);
    };

});
