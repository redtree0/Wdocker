
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
});

function makeBootstrapDialog(title, message, button){
  return new BootstrapDialog({
    title: title,
    message: message,
    buttons: button
  });
};

dialog.prototype.show = function () {
  // console.log();
    var dialogShow = makeBootstrapDialog(
      this.title,
      this.message,
      this.button
    );

    dialogShow.open();
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
