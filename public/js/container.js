// client index.js
'use strict';

var socket = io();

var columns = [{
      checkbox: true,
      title: 'Check'
  },{
      field: 'Id',
      title: 'Id'
  }, {
      field: 'Names',
      title: 'Item Names'
  }, {
      field: 'Image',
      title: 'Image'
  }, {
      field: 'ImageID',
      title: 'ImageID'
  }, {
      field: 'Command',
      title: 'Command'
  }, {
      field: 'Created',
      title: 'Created'
  }, {
      field: 'Ports',
      title: 'Ports'
  }, {
      field: 'Labels',
      title: 'Labels'
  }, {
      field: 'State',
      title: 'State'
  }, {
      field: 'Status',
      title: 'Status'
  }, {
      field: 'HostConfig',
      title: 'HostConfig'
  }, {
      field: 'NetworkingSettings',
      title: 'NetworkingSettings'
  }, {
      field: 'Mounts',
      title: 'Mounts'
  }];



function containerSettings ($image, $name, $cmd, portArray){

  var opts = containerDefaultSettings();
  console.log(arguments);
    if($image.text().trim() == "Images"){
      return false;
    }
    if (hasValue($name.val(), $cmd.val(), portArray)) {

    for ( var i in portArray) {
      var portinfo = portArray[i].containerPort +"/"+ portArray[i].protocol;
      opts.ExposedPorts[portinfo] = {};
        opts.HostConfig.PortBindings[portinfo] = [{ "HostPort" : portArray[i].hostPort}];
    }


    opts.Image = $image.text().trim();
    opts.name = $name.val();
    opts.Cmd.push($cmd.val());
  }

   console.log(opts);
  return  opts;
}

function detailFormatter(index, row) {

}
$(function(){

    var $container = $(".jsonTable");
    var $image =$('#image');
    var $name = $("#name");
    var $command = $("#command");
    var $containerPort = $("#containerPort");
    var $hostPort = $("#hostPort");
    var $protocol = $("#protocol");
    var $detail = $(".detail");
    var $list = $(".addlist");
    var checklist = [];
    var $form = $("#CreateContainer");
    initDropdown('/myapp/images/data.json', $(".dropdown-menu"), $image, "RepoTags", 0);
    initUrlTable($container, columns,'/myapp/container/data.json', detailFormatter);

    clickTableRow($container, $detail);
    clickRowAddColor($container, "danger");
    checkTableEvent($container, checklist);

    $container.on("expand-row.bs.table", function (e, index, row, $detail){
      console.log(index);
      console.log(row);
      // console.log($detail.closest(".detail-view").append("1234"));
      $.getJSON("/myapp/container/stats/"+ row.Id,  {}, function(json, textStatus) {
        $detail.html("<p>" + json.read + "</p>");
      });
      // $detail.append("<span style='color:black'>12345</span>");
    })
    $(".create").click((e)=>{

      var opts = containerSettings($image, $name, $command, portlist);

      formAction($("#CreateContainer"), opts, socket,
      (data)=>  {
        console.log("reloa");
        console.log(data);
        reloadTable($container);
        dialogShow("title", "message");
      });

    });

    var portlist= [];

    $(".add").click((e)=>{
        e.preventDefault();
        var $array = [$containerPort, $hostPort, $protocol];
        var state = true;
        for (var i in $array) {
          if(!(hasValue($array[i].val()))){
            state = false;
          }
        }
        if(state) {
          addDataArray(portlist, $array);
          makeList ( $list, portlist );
        }
    });

        clickDeleteList($list, portlist);
        // isFinished();

function socketEvent(eventName, listArray){
  socket.emit(eventName, checklist, (data)=>{
    checklist.splice(0,checklist.length);
    console.log(data);
      reloadTable($container);
     dialogShow("title", data.msg);

  });
}

    $(".start").click((e)=>{
                socketEvent("StartContainer", checklist);
    });

    $(".stop").click((e)=>{
        socketEvent("StopContainer", checklist);
    });

    $(".remove").click((e)=>{
        socketEvent("RemoveContainer", checklist);
    });

    $(".kill").click((e)=>{
        socketEvent("KillContainer", checklist);
    });

    $(".pause").click((e)=>{
        socketEvent("PauseContainer", checklist);
    });

    $(".unpause").click((e)=>{
        socketEvent("UnpauseContainer", checklist);
    });

    // $(".ctlbtn").click(function() {
    //       var doIt =$(this).attr('id');
    //       // console.log(dstack);
    //       socket.emit(doIt, dstack);
    //       doneCatch(socket, ()=>{
    //         dstack= new Array();
    //       });
    //       reloadTable($container);
    // });
});



// function postSubmit (_url, _data) {
//   $.ajax({
//               type: 'POST',
//               url: _url,
//               data: _data,
//               dataType: 'json',
//               success: function(req) {
//                 console.log('success');
//                 console.log(req);
//               },
//               error : function(request, status, error ) {   // 오류가 발생했을 때 호출된다.
//                 console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
//               },
//               complete : function () {   // 정상이든 비정상인든 실행이 완료될 경우 실행될 함수
//                     console.log("complete");
//                     // setTimeout(postSubmit(_url, _data), 5000);
//                     // getAjax ();
//               }
//       });
// }
