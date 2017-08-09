
var dialog = (function dialog(title, message, $body){
  this.title = title;
  this.message = message;
  this.button =  [{
        label: 'Close'
        ,
        action: function(dialogItself){
          dialogItself.close();
        }
   }];
  this.$body = $body;
  this.dialogInstance = null;
});

function makeBootstrapDialog(title, message, button){
  return new BootstrapDialog({
    title: title,
    message: message,
    buttons: button,
    autodestroy : false
  });
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
    var $body = (this.$body);
    diaglogInstance.getModalBody().html('Dialog closes in 5 seconds.');
    setTimeout(function(){
              diaglogInstance.close();
               $body.spinStop();
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
