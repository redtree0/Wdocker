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
  }, {
      field: 'Status.State',
      title: 'State'
  }, {
      field: 'Status.Addr',
      title: 'Addr'
  }
 ];
var socket = io ();

$(function () {

    var $node = $(".jsonTable");
    var $detail = $(".detail");
    var $availability = $("#availability");
    var $role = $("#role");
    var checklist = [];
    initUrlTable($node, columns,'/myapp/node/data.json');
    checkTableEvent($node, checklist);
    clickTableRow($node, $detail);
    clickRowAddColor($node, "danger");

    changeTextDropdown($(".dropdown-menu"), $availability);

    $(".start").click((e)=>{
      e.preventDefault();
      socket.emit("StartNode",checklist);
    })

    $(".delete").click((e)=>{
      e.preventDefault();
      socket.emit("RemoveNode",checklist);
    })

    $(".update").click((e)=>{
      e.preventDefault();
      var opts = {
        "Availability" : $availability.text(),
        "Role" : $role.prop('checked') ? "manager" : "worker"
       };

      socket.emit("UpdateNode",checklist, opts);
      reloadTable($node);
    })
});
