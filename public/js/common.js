// "use strict";

function initDropdown(jsonUrl, $li, $button, opts) {
  var hasIndex = false;

  // attr, index, selected
  if(opts.hasOwnProperty("attr")){

    if(opts.hasOwnProperty("index")){
        hasIndex = true;
    }
  }

  $li.children().remove();
  $.getJSON(jsonUrl, function(json, textStatus) {
      json.forEach ( (data) => {
        // console.log(data);
        var value = null;
        if( hasIndex ) {
          value = (data[opts.attr])[opts.index];
          // console.log("t");
        }else {
           value = data[opts.attr];
          //  console.log("F");
        }


        if(opts.hasOwnProperty("selected") && value === opts.selected){
          $button.text(value);
        }
        // console.log(value);
        $("<li><a>" +  value + "</a><li/>").appendTo($li);
      });
  });
  changeTextDropdown($li, $button);
}

function initDropdownArray(args, $li, $button, callback ){
  $li.children().remove();
  for (var index in args) {
      $("<li><a>" + args[index] + "</a><li/>").appendTo($li);
  }
  changeTextDropdown($li, $button, callback);
}

function changeTextDropdown ($li, $button, callback) {
  $li.on("click", "li a", function(event){

        $button.text($(this).text());
        if( typeof callback == "function") {
          callback($(".jsonTable"), $li.find("a").text(), "success");
        }
    });
}


function hasValue (){
  var arg = arguments;
  // console.log(arguments);
  for(var i in arg) {
    // console.log(arg[i]);
    // console.log(typeof arg[i]);
    // console.log(arg[i] === null);
    // console.log(typeof arg[i] === undefined);
    // console.log(typeof arg[i] === null);
    // console.log(arg[i] === "");
    if (arg[i] === "" || typeof arg[i] === null || arg[i] === null || typeof arg[i] === undefined  ||  arg[i] === undefined){
      console.log("c");
      return false;
    }
  }
  return true;
}
 // glyphicon-log-in
function createButton( buttonid , action, color, icon){
  var $button = createElement("<button/>", "btn " + action + " " + color, "", buttonid);
  var $icon = createElement("<span/>", "glyphicon " + icon, "");
  return $button.append($icon);
}

    function insertArray(lists, $arrays){

      var json = {};
      for ( var i in  $arrays) {
        var val = $arrays[i].val();
        if( $arrays[i].val() == "on" ||  $arrays[i].val() == "off") {
          val = ( $arrays[i].prop('checked') ? "tcp" : "udp");
        }
        json[$arrays[i].attr("id")] = val;
      }
      lists.push(json);
      console.log(lists);
    }

function createList ( $list, array ) {
    $list.children().remove();
    // console.log("createlists");
    for(var index in array) {
        // console.log(array[index]);
        var rowid = "#row"+ index;
        var $row = createElement("<div/>", "row", "", "row"+ index);
        var $deletebutton = createButton(index, "delete", "btn-danger", "glyphicon-remove");
        // var $connectbutton = createButton(index, "connection", "btn-success", "glyphicon-log-in");
        // [$deletebutton, $connectbutton]
        $list.append(createRow($row, array[index],  [$deletebutton]));
    }

}

  function createRow($row, array, $buttons){
    var data = array;
    // console.log("createrow");

    for (var index in data ) {

        $row.append(createElement("<div/>", "col-sm-2 " + index, data[index]));
    }
    // for (var i in $elements) {
    // }
    for (var i in $buttons) {
      $row.append($buttons[i]);
    }
    return $row;

  }

function clickDeleteList($list, dataLists){
      $list.on('click', 'button', function(e){
      e.preventDefault();
      // console.log("click");

      var id = "#row" + $(this).attr("id");
          if($(this).hasClass("delete")) {
            $(id).fadeOut("slow");

            dataLists.splice($(this).attr("id"), 1);

            createList ( $list, dataLists);
          }
    });
}


function createElement( _element, _class,  _text, _id, _type){
  return $(_element, { class: _class, text: _text , id: _id, type: _type});
}
