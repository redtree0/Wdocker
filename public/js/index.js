"use strict";

$(function () {
  
         setInterval(()=> {
           $.getJSON('/myapp/stats/data.json', function(json, textStatus) {
              var memory = json.memory;
               var val =  memory.usedmem / memory.totalmem * 100;
                 gauge.update(val);
           });


           $.getJSON('/myapp/stats/cpus.json', function(json, textStatus) {

                   var data = [
                     defaultPieSetting({ x: [0, .48], y: [.51, 1]}, "cpu1")
                   , defaultPieSetting({ x: [0.52, 1], y: [0.52, 1]}, "cpu2")
                   , defaultPieSetting({ x: [0, .48], y: [0, .49]}, "cpu3")
                   , defaultPieSetting({ x: [0.52, 1], y: [0, .49]}, "cpu4")];

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
              var colClass = "col-md-6";
              var cpus = json.cpus;

              $("#cpu_core").append(addRowText(colClass, "CPU Core Number"));
              $("#cpu_core").append(addRowText(colClass, cpus.length));
              $("#cpu_model").append(addRowText(colClass, "CPU Model"));
              $("#cpu_model").append(addRowText(colClass, cpus[0].model));

              var network = (json.networkInterfaces);
              var $networkInfo = $("#networkInfo");
              for( var type in network) {

                $networkInfo.append(addRowText(colClass, "type"));
                $networkInfo.append(addRowText(colClass, type));
                $networkInfo.append(addRowText(colClass, "IP Address"));
                $networkInfo.append(addRowText(colClass, (network[type])[0].address ));
                $networkInfo.append(addRowText(colClass, "IP Family"));
                $networkInfo.append(addRowText(colClass, (network[type])[0].family ));
                $networkInfo.append(addRowText(colClass, "Mac Adrress"));
                $networkInfo.append(addRowText(colClass, (network[type])[0].mac ));
                $networkInfo.append(addRowText(colClass, "Netmask"));
                $networkInfo.append(addRowText(colClass, (network[type])[0].netmask ));
              }

              var memory = json.memory;
              var $memoryInfo = $("#memoryInfo");
              $memoryInfo.append(addRowText(colClass, "total"));
              $memoryInfo.append(addRowText(colClass, memory.totalmem));
              $memoryInfo.append(addRowText(colClass, "free"));
              $memoryInfo.append(addRowText(colClass, memory.freemem));
              $memoryInfo.append(addRowText(colClass, "used"));
              $memoryInfo.append(addRowText(colClass, memory.usedmem));

              $("#others").append(addRowText(colClass, "Release"));
              $("#others").append(addRowText(colClass, json.release));

              $("#others").append(addRowText(colClass, "OS"));
              $("#others").append(addRowText(colClass, json.platform));
              $("#others").append(addRowText(colClass, "Username"));
              $("#others").append(addRowText(colClass, json.userInfo.username));
              $("#others").append(addRowText(colClass, "Shell"));
              $("#others").append(addRowText(colClass, json.userInfo.shell));
              $("#others").append(addRowText(colClass, "Uptime"));
              $("#others").append(addRowText(colClass, json.uptime + " s"));

            function addNewRow( _id ){
                return $('<div/>', { class: "row", id : _id });
            }
            function addRowText( _class,  _text){
              return $('<div/>', { class: _class, text: _text });
            }
            console.log(textStatus);
        });

function defaultPieSetting(location, name) {
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
