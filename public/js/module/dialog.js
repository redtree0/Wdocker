
var dialog = (function dialog(title, message){
  this.title = title;
  this.message = message;
  this.button =  [{
        label: 'Close'
        ,
        action: function(dialogItself){
          dialogItself.close();
        }
   }];
  this.dialogInstance = null;
});

function makeBootstrapDialog(title, message, button){
  // var types = [BootstrapDialog.TYPE_DEFAULT,
  //            BootstrapDialog.TYPE_INFO,
  //            BootstrapDialog.TYPE_PRIMARY,
  //            BootstrapDialog.TYPE_SUCCESS,
  //            BootstrapDialog.TYPE_WARNING,
  //            BootstrapDialog.TYPE_DANGER];
  var msg = null;
  var isError = false;
  if(message.hasOwnProperty("statusCode")){
    if(message.statusCode === 200){
      msg = "작업완료"
    }else if(message.statusCode !== 200) {
      
      title = "에러발생"
      if(message.error === undefined){
        msg = message.msg;
      }else if (message.msg === undefined) {
        msg = message.error;
      }

      isError = true;
    }
  }else {
    msg = message;
  }
  var dialogInstance = new BootstrapDialog({
       title: title,
       message: msg,
       buttons: button,
       autodestroy : false
  });
  if(isError){
    dialogInstance.setType(BootstrapDialog.TYPE_DANGER);
  }
  return dialogInstance;
};

dialog.prototype.show = function () {
  // console.log();
    this.dialogInstance = makeBootstrapDialog(
      this.title,
      this.message,
      this.button
    );

    (this.dialogInstance).open();
};

dialog.prototype.close = function (timeout) {
    var diaglogInstance = (this.dialogInstance);

    diaglogInstance.getModalBody().html('Dialog closes in 5 seconds.');
    setTimeout(function(){
              diaglogInstance.close();
    }, timeout);
};

dialog.prototype.setDefaultButton= function(label, className) {

  var enterKey = 13;
  this.button = [{
       label: label,
       cssClass: className,
       hotkey: enterKey
       ,
       action:  function(dialogItself){
         dialogItself.close();
       }
   }];

};

dialog.prototype.appendButton = function(label, className, fn) {

  var button = {
       label: label,
       cssClass: className,
       action: fn
   }

   this.button.unshift(button)
};


module.exports = dialog;
