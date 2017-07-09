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


$(function () {
    var $node = $(".jsonTable");
    initUrlTable($node, columns,'/myapp/node/data.json');
});
