
function serviceSettings ($serviceName, $image, $command, $publishedPort, $targetPort, $healthCheck){
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
  opts.EndpointSpec.Ports = [{
    "Protocol" : "tcp",
    "PublishedPort" : parseInt($publishedPort.val()),
    "TargetPort" : parseInt($targetPort.val()),
  }]

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
  initDropdown('/myapp/images/data.json', $(".dropdown-menu"), $('#image'), "RepoTags", 0);
  initUrlTable($service, columns, "/myapp/service/data.json" );
  checkTableEvent($service, checklist);
  clickRowAddColor($service, "danger");


  $(".create").click(()=>{
      var $serviceName = $("#serviceName");
      var $image = $("#image");
      var $command = $("#command");
      var $publishedPort = $("#publishedPort");
      var $targetPort = $("#targetPort");
      var $healthCheck = $("#healthCheck");
      var opts = serviceSettings($serviceName, $image, $command, $publishedPort, $targetPort, $healthCheck);
      formSubmit($("#CreateService"), opts, socket, ()=> { reloadTable($service); dialogShow("title", "message")});
  });

    $(".remove").click(()=>{
        socket.emit("RemoveService", checklist);
        reloadTable($service);
        dialogShow("title", "message");
    });
});
