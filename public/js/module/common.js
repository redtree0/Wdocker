// "use strict";

function initDropdown(jsonUrl, $li, $button, opts) {
  var hasIndex = false;
  var hasFilter = false;
  // attr, index, selected
  if(opts.hasOwnProperty("attr")){
    if(opts.hasOwnProperty("index")){
        hasIndex = true;
    }
  }
  if(opts.hasOwnProperty("filter")){
    hasFilter = true;
  }

  $li.children().remove();
  $.getJSON(jsonUrl, function(json, textStatus) {
    // console.log(jsonUrl);
    // console.log(json);
    if(json !== false){
         json.some((data)=>{
           if(hasFilter){
              if(data[opts.filter.key] !== opts.filter.value){
                return false;
              };
            }
          var value = null;
              if( hasIndex ) {
                value = (data[opts.attr])[opts.index];
              }else {
                value = data[opts.attr];
              }

            if(opts.hasOwnProperty("selected") && value === opts.selected){
              $button.text(value);
            }
            // console.log(value);
            $("<li><a>" +  value + "</a><li/>").appendTo($li);
        });
    }
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
      if(!Array.isArray(lists)){
        return false;
      }else if(!Array.isArray($arrays)){
        return false;
      }
      var json = {};
      for ( var i in  $arrays) {
        var val = $arrays[i].val();
        if( $arrays[i].val() == "on" ||  $arrays[i].val() == "off") {
          val = ( $arrays[i].prop('checked') ? "tcp" : "udp");
        }

        var key = $arrays[i].attr("id");
        if(key === "keyNew"){
          json["key"] = val;
        }else if(key === "valueNew"){
          json["value"] = val;
        }else {
          json[$arrays[i].attr("id")] = val;
        }
      }
      var isOther = true;
      for (var i in lists){
        if(JSON.stringify(lists[i]) ===  JSON.stringify(json)) {
          isOther = false;
        }
      }
      if(isOther){
        lists.push(json);
      }
      // console.log("insert");
      // console.log(lists);
    }

function createList ( $list, array ) {
    $list.children().remove();
    // console.log("createlists");
    for(var index in array) {
      console.log(index);
        console.log(array[index]);
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
    console.log(data);
    for (var index in data ) {
      console.log(data[index]);
        $row.append(createElement("<div/>", "col-sm-3 text-center " + index, data[index]));
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

function initPortLists($portlists, portlists, $portAdd, $dataLists){
  createList($portlists, portlists);
  clickDeleteList($portlists, portlists);
  $portAdd.click((e)=>{
    e.preventDefault();

    var state = true;
    for (var i in $dataLists) {
      if(!(hasValue($dataLists[i].val()))){
        state = false;
      }
    }
    if(state) {
      insertArray(portlists, $dataLists);
      createList ( $portlists, portlists );
    }
  });
}


function addRowText( _class,  _text){
  return $('<div/>', { class: _class, text: _text });
}


function isSwarm(){
  $.getJSON('/myapp/swarm/data.json', function(json, textStatus) {

    if(json.statusCode === 503){
      alert("swarm 구성 필요합니다.");
      location.href="/myapp/swarm/";
    }

  });
}

function refresh(){
  setTimeout(()=>{location.reload(true)}, 3000);
}
