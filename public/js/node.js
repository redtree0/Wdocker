var columns = [{
      checkbox: true,
      title: 'Check'
  },{
      field: 'ID',
      title: 'ID'
  }, {
      field: 'CreatedAt',
      title: 'CreatedAt'
  }, {
      field: 'Spec.Role',
      title: 'Role'
  }, {
      field: 'Version.Index',
      title: 'Version'
  }, {
      field: 'Spec.Availability',
      title: 'Availability'
  }, {
      field: 'Description.Hostname',
      title: 'Hostname'
  }, {
      field: 'Description.Platform.Architecture',
      title: 'Architecture'
  }, {
      field: 'Description.Platform.OS',
      title: 'OS'
  }, {
      field: 'ManagerStatus.Addr',
      title: 'IP'
  }];
var socket = io ();

$(function () {

    var $node = $(".jsonTable");
    var $detail = $(".detail");

    var checklist = [];
    initUrlTable($node, columns,'/myapp/node/data.json');
    checkTableEvent($node, checklist);
    clickTableRow($node, $detail);
    clickRowAddColor($node, "danger");


    $(".delete").click((e)=>{
      e.preventDefault();
      socket.emit("RemoveNode",checklist);
    })

    $(".update").click((e)=>{
      e.preventDefault();
      socket.emit("UpdateNode",checklist);
    })
});
