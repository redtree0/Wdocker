//images.js
'use strict';
  var socket = io();

  var columns = [{
          checkbox: true,
          title: 'Check'
      },{
          field: 'RepoTags',
          title: 'RepoTags'
      }
      // ,{
      //     field: 'Containers',
      //     title: 'Containers'
      // }
      ,{
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
        var $image = $(".jsonTable");

        initUrlTable($image, columns,'/myapp/images/data.json');
        checkTableEvent($image, imageslist);

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
             if(doneCatch(socket)){
               $progress.css("width", '100%');
               $status.append("finished");
             };
          });

          dialogShow("Progress", $msgdiag);


        });

        $("#remove").click((e)=> {
          socket.emit("removeImages", imageslist);
        });


        function imageSettings($term, $limit, $is_automated, $is_official, $stars){
              var opts = imageDefaultSettings();

              if(!$term.val()){
                return false;
              }
              if(!$limit.val()){
                return false;
              }
              opts.term = $term.val();
              opts.limit = $limit.val();
              // console.log(typeof opts.filters["is_automated"]);
              opts.filters["is-automated"] = [($is_automated.prop('checked').toString())];
              opts.filters["is-official"] = [$is_official.prop('checked').toString()];
              if(!$stars.val()) {

              } else {
                opts.filters["stars"] = [$stars.val()];
              }

              console.log(opts);
          return opts;
        }

        $(".create").click((e)=>{
          // formSubmit($("#SearchImages"), )
            // e.preventDefault();
            var $term=$("#term");
            var $limit =$('#limit');
            var $is_automated = $('#is_automated');
            var $is_official = $('#is_official');
            var $stars = $("#stars");

            var opts = imageSettings($term, $limit, $is_automated, $is_official, $stars);
            formSubmit($("#SearchImages"), opts, socket);
        });

          socketErrorCatch(socket);
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

              initDataTable($(".dataTable"), columns, data);
              loadTable($(".dataTable"), data);
              checkTableEvent($(".dataTable"), searchlist);

            });

});
