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
        var imageslist =[];
        var searchlist =[];
        initUrlTable('imagelist', columns,'/myapp/images/data.json');
      //  TestTable('imagelist', '/myapp/images/data.json');
        checkTableEvent('imagelist', imageslist);

        var $status = $('<div></div>');
        var $msgdiag = $("<div></div>");
        $msgdiag.addClass('progress');
        var $progress = $("<div class='progress-bar progress-bar-striped' role='progressbar' style='width: 0%' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100'></div>");
        $progress.css("width", '0%');
        $msgdiag.append($progress);

        $("#download").click((e)=> {
          socket.emit("pullImages", searchlist);
          socket.on("progress", (event)=> {
             $status.text("");
             $status.append(event.status);

             var progress =  event.progress;
             $msgdiag.after($status);
             if(progress != null){
               var count = (progress.match(/=/g) || []).length;
               $progress.css("width", count * 2 + '%');
             } else {
               $progress.css("width", '0%');
             }
          });

          BootstrapDialog.show({
              title: 'Progress',
              message: function(){
                var $message = $msgdiag;

                return $message ;
              } ,

              buttons: [ {
                    label: 'Close',
                    action: function(dialogItself){
                        dialogItself.close();
                    }
                }]
          });

        });

        $("#remove").click((e)=> {
          socket.emit("removeImages", imageslist);
        });

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
            socket.on("errCatch", (err)=> {  
                if(err.statusCode == "409") {
                  alert(err.json.message);
                }
            })
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

              initDataTable('results', columns, data);
              loadTable('results', data);
              checkTableEvent('results', searchlist);

            });

});
