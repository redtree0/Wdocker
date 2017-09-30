$(function() {
    $('#login').bootstrapLogin({
        title : "Docker Wave",
        onSubmit: function(username, password) {
          $.post("/myapp/admin/data",
          {
              username: username,
              password: password
          },
          function(data, status){
            console.log(data);
              if(data){
                // console.log("!@#$");
                location.href = '/myapp/index';
                return true;
              }else {
                return false;
              }
          });
          // return false;
        }
    });
    var dialog = require("./module/dialog.js");
    var $signup = $("#hiddenForm");
    var $username = $("#username");
    var $password = $("#password");
    var $cpassword = $("#cpassword");
    $signup.hide();
    $("#signup").click((e)=>{
        var signup = new dialog("Sign Up", $signup.show());
        signup.appendButton('Sign Up', 'btn-primary create', ()=>{
          var username = $username.val().trim();
          var password = $password.val().trim();
          if(username === undefined || username === null || password === undefined || password === null){
            return;
          }
          if(password !== $cpassword.val().trim()){
            alert("비밀번호가 다릅니다.");
            return ;
          }
          $.post("/myapp/admin/new",
          {
              username: username,
              password: password
          },
          function(data, status){

              // if(data){
                  var popup = new dialog("작업완료", "");
                  popup.show();
              // }

          });
        });
        signup.show();
    });

});
