
function serviceSettings ($serviceName, $image, $command, portlist, $healthCheck){
  var opts = serviceDefaultSettings();
  if(!(hasValue($serviceName.val(), $image.text().trim()))){
    alert("t");
    return false;
  }
  // console.log(typeof $publishedPort.val());;
  opts.Name = $serviceName.val()
  opts.TaskTemplate.ContainerSpec.Image = $image.text().trim();
  opts.TaskTemplate.ContainerSpec.Command = [$command.val()];
  // opts.TaskTemplate.ContainerSpec.HealthCheck.Test = [$healthCheck.val()];
  opts.EndpointSpec.Ports = portlist;

  return opts;
}

var columns = [{
      checkbox: true,
      title: 'Check'
  },{
      field: 'ID',
      title: 'ID'
  }, {
      field: 'Spec.Name',
      title: 'Name'
  }, {
      field: 'Spec.TaskTemplate.ContainerSpec.Image',
      title: 'Image'
  }, {
      field: 'Spec.TaskTemplate.ContainerSpec.Command',
      title: 'Command'
  }, {
      field: 'Endpoint.Spec.Ports.0.Protocol',
      title: 'Protocol'
  }, {
      field: 'Endpoint.Spec.Ports.0.PublishedPort',
      title: 'PublishedPort'
  }, {
      field: 'Endpoint.Spec.Ports.0.TargetPort',
      title: 'TargetPort'
  }];

$(function(){
  var socket = io();
  var checklist = [];
  var $service = $(".jsonTable");
  var $serviceName = $("#serviceName");
  var $image = $("#image");
  var $command = $("#command");
  var $publishedPort = $("#publishedPort");
  var $targetPort = $("#targetPort");
  var $healthCheck = $("#healthCheck");
  var $publishedPort = $("#publishedPort");
  var $targetPort = $("#targetPort");
  var $protocol = $("#protocol");
  initDropdown('/myapp/images/data.json', $(".dropdown-menu"), $('#image'), "RepoTags", 0);
  initUrlTable($service, columns, "/myapp/service/data.json" );
  checkTableEvent($service, checklist);
  clickRowAddColor($service, "danger");


  $(".create").click(()=>{

      var opts = serviceSettings($serviceName, $image, $command, portlist, $healthCheck);
      console.log(portlist);
      formSubmit($("#CreateService"), opts, socket, ()=> { reloadTable($service); dialogShow("title", "message")});
  });

    $(".remove").click(()=>{
        socket.emit("RemoveService", checklist);
        reloadTable($service);
        dialogShow("title", "message");
    });

    var id = 0;
    var portlist = [];
    $(".add").click((e)=>{
        e.preventDefault();
        var $array = [$publishedPort, $targetPort, $protocol];
        var state = true;
        for (var i in $array) {
          if(!(hasValue($array[i].val()))){
            state = false;
          }
        }
        if(state) {
          addlist($array, $(".addlist") , id++, portlist);

        }
    });


    clickDeleteList($(".addlist"));


});
