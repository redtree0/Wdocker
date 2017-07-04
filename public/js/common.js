function initDropdown(jsonUrl, $li, $button) {
  $.getJSON(jsonUrl, function(json, textStatus) {
      json.forEach ( (data) => {
        $("<li><a>" +  data.RepoTags[0] + "</a><li/>").appendTo('ul.dropdown-menu');
      });
  });

  $li.on("click", "li a", function(event){
        $button.text($(this).text());
    });
}


function containerDefaultSettings() {
  return {
    "Image" : "",
    "name" : "",
    "AttachStdin": false,
    "AttachStdout": true,
    "AttachStderr": true,
    "ExposedPorts": { },
    "Tty": false,
    "Cmd": [  ],
    "OpenStdin": true,
    "StdinOnce": false,
     "HostConfig" : {
       "PortBindings" : {}
     }
  }
}

function formSubmit($form, settings, socket, callback) {
  $form.submit(function(e) {
    //  e.preventDefault();
    var opts = settings;
    console.log("do");
    // callback();
    console.log(opts);
    socket.emit($form.attr("id"), opts);

    e.preventDefault();
    callback();
  });
}

function dialogShow(_title, _message) {
    return BootstrapDialog.show({
        title: _title,
        message: _message,
        buttons: [ {
              label: 'Close',
              action: function(dialogItself){
                  dialogItself.close();
              }
          }]
    });
}
