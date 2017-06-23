"use strict";

$(function () {

         setInterval(()=> {
           $.getJSON('/myapp/stats/data.json', function(json, textStatus) {
               var val =  json.usedmem / json.totalmem * 100;
                 gauge.update(val);
           });


           $.getJSON('/myapp/stats/cpus.json', function(json, textStatus) {

                   var data = [
                     defaultSetting({ x: [0, .48], y: [.51, 1]}, "cpu1")
                   , defaultSetting({ x: [0.52, 1], y: [0.52, 1]}, "cpu2")
                   , defaultSetting({ x: [0, .48], y: [0, .49]}, "cpu3")
                   , defaultSetting({ x: [0.52, 1], y: [0, .49]}, "cpu4")];

                  var layout = {
                           title: 'CPU info',
                           annotations: [
                             defaultAnnotationsSetting({x: 0.15, y: 0.78}, "CPU1")
                           , defaultAnnotationsSetting({x: 0.8, y: 0.78}, "CPU2")
                           , defaultAnnotationsSetting({x: 0.15, y: 0.23}, "CPU3")
                           , defaultAnnotationsSetting({x: 0.82, y: 0.23}, "CPU4")
                           ],
                           height: 550,
                           width: 450,
                         };

                 for(var i in json) {
                   $.each(json[i].per, (key, val)=>{
                       data[i].values.push(val.used);
                       data[i].labels.push(val.type);
                   });
                 }
                   Plotly.newPlot('cpuStatus', data, layout);

                 });
       }, 3000);

        var config = liquidFillGaugeDefaultSettings();
            config.circleColor = "#FF7777";
            config.textColor = "#FF4444";
            config.waveTextColor = "#FFAAAA";
            config.waveColor = "#FFDDDD";
            config.circleThickness = 0.2;
            config.textVertPosition = 0.2;
            config.waveAnimateTime = 1000;
        var gauge = loadLiquidFillGauge("memoryStatus", 1, config);

        $.getJSON('/myapp/stats/data.json', function(json, textStatus) {
            var list = [];
            console.log(json);
            $.each(json, (key, value)=>{
              //console.log("Key : %s, value : %s , value type : %s",key, JSON.stringify(value), typeof value);
              list.push("<li>"+ key + " : " + JSON.stringify(value)+"</li>");
              }
            );
            $("#stats").append(list);
            var networkinfo = (json.networkInterfaces);
            for( var type in networkinfo) {
              $("#networkInterfaces").append(addRowText("col-md-12", type));
              $("#networkInterfaces").append(addRowText("col-md-6", (networkinfo[type])[0].address ));
              $("#networkInterfaces").append(addRowText("col-md-6", (networkinfo[type])[0].family ));
              $("#networkInterfaces").append(addRowText("col-md-6", (networkinfo[type])[0].mac ));
              $("#networkInterfaces").append(addRowText("col-md-6", (networkinfo[type])[0].netmask ));
            }

            var cpuinfo = json.cpus;
            $("#cpuInfo").append(addRowText("col-md-4", "CPU"));
            $("#cpuInfo").append(addRowText("col-md-4", cpuinfo.length));
            $("#cpuInfo").append(addRowText("col-md-4", cpuinfo[0].model));

              $("#Info").append(addRowText("col-md-3", json.release));
              $("#Info").append(addRowText("col-md-3", json.platform));
              console.log((json.userInfo.shell));
              $("#Info").append(addRowText("col-md-3", json.userInfo.username));
              $("#Info").append(addRowText("col-md-3", json.userInfo.shell));
            function addRowText( _class,  _text){
              return $('<div/>', { class: _class, text: _text });
            }
            console.log(textStatus);
        });

function defaultSetting(location, name) {
  return {
    values: [],
    labels: [],
    domain: location,
    marker: {         // marker is an object, valid marker keys: #scatter-marker
      colors: ["#ffff33", "#FFDDDD", "#ff9933", "#70db70", "#66b3ff"] // more about "marker.color": #scatter-marker-color
  },
    name: name,
    hoverinfo: 'label+percent+name',
    hole: .7,
    type: 'pie'
  }
}

function defaultAnnotationsSetting(location, name) {
  return  {
     font: { size: 14 },
     showarrow: false,
     text: name,
     x: location.x,
      y: location.y
   }
}
});
