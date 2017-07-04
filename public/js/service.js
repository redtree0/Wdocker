$(function(){
  var socket = io();
  function initDropdown() {
    $.getJSON('/myapp/images/data.json', function(json, textStatus) {

        json.forEach ( (data) => {
      //    console.log(data.RepoTags[0]);
          $("<li><a>" +  data.RepoTags[0] + "</a><li/>").appendTo('ul.dropdown-menu');
        });
    //    console.log(textStatus);
    });


    $(".dropdown-menu").on("click", "li a", function(event){
      //    console.log("You clicked the drop downs", event);
      //    console.log($('#images').text());
          $('#image').text($(this).text());
      });
  }

  initDropdown();

  $("#CreateService").submit((e)=>{
    e.preventDefault();
    var $serviceName = $("#serviceName");
    var $image = $("#image");
    var $publishedPort = $("#publishedPort");
    var $targetPort = $("#targetPort");

    var _serviceName = $serviceName.val().toString();
    var _image = $image.text().trim().toString();
    var _publishedPort = $publishedPort.val().toString();
    var _targetPort = $targetPort.val().toString();

    var opts = {
      "Name" : _serviceName,
      "TaskTemplate" : {
        "ContainerSpec" : {
          "Image" : _image
        }
      },
      "EndpointSpec": {
            "Ports": [
                  {
                  "Protocol": "tcp",
                  "PublishedPort": _publishedPort,
                  "TargetPort": _targetPort
                  }
              ]
        }
    }
    console.log(JSON.stringify(opts));
    socket.emit("CreateService", opts);
  });


});
