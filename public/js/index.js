// client index.js
'use strict';

var socket = io();

var _columns = [{
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

var dstack = [{"doIt" : ""}];

function initDataTable() {
  $('#ctable').bootstrapTable({
      url: '/myapp/container/data.json',
      columns: _columns,
      silent: true
  });
}

function reloadTable()
{
      setTimeout(()=> {$('#ctable').bootstrapTable('refresh');
    console.log("reload");}, 1000);
}

function jsontest() {
  $.getJSON('/myapp/images/data.json', function(json, textStatus) {
      console.log(json.data);

      json.data.forEach ( (data) => {
        console.log(data.RepoTags);
      });
    //  console.log(json.RepoTags);
      console.log(textStatus);
      /*optional stuff to do after success */
  });
}

$(function(){
      jsontest();
      $(".dropdown-menu").on("click", "li a", function(event){
        //    console.log("You clicked the drop downs", event);
        //    console.log($(this).text());
            //console.log($("li").find("a").text());
        //    console.log($('#images').text());
            $('#images').text($(this).text());
        });

    initDataTable();

    $("#CreateContainer").submit(function(e) {
      e.preventDefault();
      var $msgForm = $("#msgForm");
      var msg = $msgForm.val();

      var tmp = {
        Image: 'izone/arm:jessie-slim',
        name : msg,
        AttachStdin: false,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
        Cmd: ['/bin/bash' ],
        OpenStdin: true,
        StdinOnce: false
      }
      // 서버로 메시지를 전송한다.
      socket.emit("chat", tmp);
      $msgForm.val("");
      reloadTable();

      BootstrapDialog.show({
          title: 'Container',
          message: msg,
          buttons: [ {
                label: 'Close',
                action: function(dialogItself){
                    dialogItself.close();
                }
            }]
      });
    });



    // r - row , e - element
    $("#ctable").on('check.bs.table	', function (r,e) {
      var dctl = {};
      dctl.Id = e.Id;
      dctl.State = e.State;
      console.log(e.Id);
      dstack.push(dctl);
      });

    $("#ctable").on('uncheck.bs.table', function (r,e) {
      dstack.forEach((d, index, object) => {
        if( (e.Id == d.Id) &&  (e.State == d.State) ) {
              object.splice(index, 1);
        }
      });
  });

// r - event , e - data
    $("#ctable").on('check-all.bs.table', function (r,e) {
        console.log(e);
        e.forEach((data) => {
          dstack.push(data);
        });
        console.log(dstack);
    });

    $("#ctable").on('uncheck-all.bs.table', function (r,e) {
        console.log(e);
        e.forEach((data) => {
          dstack.pop(data);
        });
      });

    $(".ctlbtn").click(function() {
    //  if(!dctl.id && !dctl.state){
      if(!dstack[0]){
        console.log("empty");
      } else{
          dstack[0].doIt =$(this).attr('id');
          console.log(dstack);
          socket.emit("dctl", dstack);
      }
      reloadTable();
    });
});
