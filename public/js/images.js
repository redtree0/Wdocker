//images.js
'use strict';
  var socket = io();

  var columns = [{
          checkbox: true,
          title: 'Check'
      },{
          field: 'Containers',
          title: 'Containers'
      },{
          field: 'Created',
          title: 'Created'
      },{
          field: 'Id',
          title: 'Id'
      },{
          field: 'Labels',
          title: 'Labels'
      },{
          field: 'ParentId',
          title: 'ParentId'
      },{
          field: 'RepoDigests',
          title: 'RepoDigests'
      },{
          field: 'RepoTags',
          title: 'RepoTags'
      },{
          field: 'SharedSize',
          title: 'SharedSize'
      },{
          field: 'Size',
          title: 'Size'
      },{
          field: 'VirtualSize',
          title: 'VirtualSize'
      }];


      $(function(){

        initUrlTable('imagelist', columns,'/myapp/images/data.json');
      //  TestTable('imagelist', '/myapp/images/data.json');

        $("#SearchImages").submit(function(e) {
          e.preventDefault();
          var $term=$("#term");
          var $limit =$('#limit');
          var $is_automated = $('#is_automated');
          var $is_official = $('#is_official');
          var $stars = $("#stars");

          var _term = $term.val();
          var _limit = $limit.val();
          var _is_automated = $is_automated.prop('checked').toString();
          var _is_official = $is_official.prop('checked').toString();
          var _stars = $stars.val();
          if( !_stars ){
            _stars = "0";
          }
          var opts = {
            term : _term,
            limit : _limit,
            filters : {}
          };
          opts["filters"] = {
            "is-automated" : [_is_automated],
            "is-official": [_is_official],
            "stars" : [_stars]
          };


          socket.emit("searchImages", opts);
          });
          
            socket.on("searchResult", function(data){
              var results = JSON.stringify(data);

              var columns = [{
                      checkbox: true,
                      title: 'Check'
                },{
                field: 'star_count',
                title: 'star_count'
              }, {
                field: 'is_official',
                title: 'is_official'
              }, {
                field: 'name',
                title: 'name'
              }, {
                field: 'is_automated',
                title: 'is_automated'
              }, {
                field: 'description',
                title: 'description'
              }];
              var stack = [];
              initDataTable('results', columns, data);
              $('#results').bootstrapTable('load', data);
              checkAlltable('results', stack);
              uncheckAlltable('results', stack);
              checkOneTable('results', stack);
              uncheckOneTable('results', stack);
              console.log(stack);
            });



        $("#download").click((e)=> {
          socket.emit("pullImages", "swarm");
        });

        $("#remove").click((e)=> {
          socket.emit("removeImages", "swarm");
        });
});
