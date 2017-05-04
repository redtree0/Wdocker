$(document).ready(function () {

});


$(function () {
    $('#select_btn').click(function (e){
      e.preventDefault();
      console.log('push');
      var data = {};
      data.title = 'title';

      data.message = $('#test').val();
      console.log(data);
      var jsondata = JSON.stringify(data);

      $.ajax({
          type: 'POST',
          contentType: 'application/json',
          dataType: 'json',
          data: jsondata,
          url: '/myapp',
          success: function (data) {
              console.log('POST success');

              console.log(data);

          }

          });
    })
    /*
    $('#select_link').click(function (e) {
        e.preventDefault();
        console.log('select_link clicked');

        var data = {};
        data.title = 'title';
        data.message = 'message';

        var jsondata = JSON.stringify(data);
        //console.log(jsondata);
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: jsondata,
            url: '/myapp',
            success: function (data) {
                console.log('POST success');

                console.log(data);

            }

            });
            */
/*
            sucess, complete 순으로 완료

            ajax error 코드
            error: function(jqXHR, textStatus, errorThrown) {
             var errorMsg = 'status(code): ' + jqXHR.status + '\n';
             errorMsg += 'statusText: ' + jqXHR.statusText + '\n';
             errorMsg += 'responseText: ' + jqXHR.responseText + '\n';
             errorMsg += 'textStatus: ' + textStatus + '\n';
             errorMsg += 'errorThrown: ' + errorThrown;
             alert(errorMsg);
         }
*/
/*
              ajax GET 방식
              $.ajax({
              type: 'GET',
              contentType: 'application/json',
              //dataType: 'json',
              url: '/myapp',
              success: function (data) {
                  console.log('GET success');
                  console.log(data);
              }
            });
*/
    });
//});
