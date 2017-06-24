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

var dstack = [];


function initDropdown() {
  $.getJSON('/myapp/images/data.json', function(json, textStatus) {

      json.forEach ( (data) => {
    //    console.log(data.RepoTags[0]);
        $("<li><a>" +  data.RepoTags[0] + "</a><li/>").appendTo('ul.dropdown-menu');
      });
  //    console.log(textStatus);
  });
}

$(function(){

  socket.on("errCatch", (err)=> {
    alert(JSON.stringify(err));
      if(err.statusCode == "409") {
        alert(err.json.message);
      }
  });

      initDropdown();
      $(".dropdown-menu").on("click", "li a", function(event){
        //    console.log("You clicked the drop downs", event);
        //    console.log($('#images').text());
            $('#image').text($(this).text());
        });

    initUrlTable('ctable', columns,'/myapp/container/data.json');


    $("#CreateContainer").submit(function(e) {
      e.preventDefault();
      var $name=$("#name");
      var $image =$('#image');
      var $command = $("#command")

      var _name = $name.val();
      var _image = $image.text().trim();
      var _command = $command.val();
      //console.log(images.trim());
      if(_image === "Images") {
        alert ("images 선택 하시오.");
        return;
      }

      var container = {
        Image: _image,
        name : _name,
        AttachStdin: false,
        AttachStdout: true,
        AttachStderr: true,
        Tty: false, // tty : false 로 해야 web terminal에서 docker attach가 됨
        Cmd: [ _command ],
        OpenStdin: true,
        StdinOnce: false
      }
      // 서버로 메시지를 전송한다.
      socket.emit("CreateContainer", container);
      $name.val("");
      $image.text("Images");
      reloadTable('ctable');

      BootstrapDialog.show({
          title: 'Container',
          message: _name + "|" + _image,
          buttons: [ {
                label: 'Close',
                action: function(dialogItself){
                    dialogItself.close();
                }
            }]
      });
    });


    clickTableRow('ctable', 'detail');

    checkOneTable('ctable', dstack);
    uncheckOneTable('ctable', dstack);
    checkAlltable('ctable', dstack);
    uncheckAlltable('ctable', dstack);


    $(".ctlbtn").click(function() {
          var doIt =$(this).attr('id');
        //  console.log(dstack);
          socket.emit(doIt, dstack,()=>{
            dstack=[];
          });

          reloadTable("ctable");
    });
});
