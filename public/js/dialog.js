function dialogShow(_title, _message, button) {

    var dialog = new BootstrapDialog({
      title: _title,
      message: _message,
      buttons: [ {
        label: 'Close',
        action: function(dialogItself){
          dialogItself.close();
        }
      }]
    });

    if(button) {
      appendButton(dialog, button)
    }else {

    }
    return dialog.open();

}

function appendButton(dialog, button) {
    return dialog.options.buttons.unshift(button);
}

function dialogbutton(_label, _class, Actionfn) {

    var button = {
       label: _label,
       cssClass: _class,
       action: Actionfn
   }
  return button;
}
