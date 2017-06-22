"use strict";

$(function () {

         setInterval(()=> {
           $.getJSON('/myapp/stats/data.json', function(json, textStatus) {
               var val =  json.data.usedmem / json.data.totalmem * 100;
              //  console.log(json);
              //  console.log(json.data.usedmem);
              //  console.log(json.data.totalmem);
              //  console.log(val);
                 gauge1.update(val);
           });

           $.getJSON('/myapp/stats/cpus.json', function(json, textStatus) {
          //    console.log(json);
              for(var i = 0, len = json.length; i < len; i++) {
//                  console.log(json[i]);
                      for(var type in json[i].per) {
                        // console.log((json[i].per[0]));
                         gauge3.update((json[i].per[0].used));
                        // console.log((json[i].per[1]));
                        // console.log((json[i].per[2]));
                        // console.log((json[i].per[3]));
                       }
              }
            //     gauge1.update(val);
           });
       }, 3000);
         $('#fillgauge2').on('click',function(){
           gauge2.update(NewValue());
          });
        function NewValue(){
                if(Math.random() > .5){
                    return Math.round(Math.random()*100);
                } else {
                    return (Math.random()*100).toFixed(1);
                }
            }
        var gauge1 = loadLiquidFillGauge("fillgauge1", 55);
        var config1 = liquidFillGaugeDefaultSettings();
        config1.circleColor = "#FF7777";
        config1.textColor = "#FF4444";
        config1.waveTextColor = "#FFAAAA";
        config1.waveColor = "#FFDDDD";
        config1.circleThickness = 0.2;
        config1.textVertPosition = 0.2;
        config1.waveAnimateTime = 1000;
        var gauge2= loadLiquidFillGauge("fillgauge2", 28, config1);
        var gauge3= loadLiquidFillGauge("fillgauge3", 28, config1);
        $.getJSON('/myapp/stats/data.json', function(json, textStatus) {
            var list = [];
            console.log(json);
            $.each(json.data, (key, value)=>{
              console.log("Key : %s, value : %s , value type : %s",key, JSON.stringify(value), typeof value);
              list.push("<li>"+ key + " : " + JSON.stringify(value)+"</li>");
              }
            );
            $("#stats").append(list);
          //  data = json;
            console.log(textStatus);
        });

function defaultSetting(location) {
  return {
    values: [],
    labels: [],
    domain: location,
    marker: {         // marker is an object, valid marker keys: #scatter-marker
      colors: ["#ffff33", "#FFDDDD", "#ff9933", "#70db70", "#66b3ff"] // more about "marker.color": #scatter-marker-color
  },
    name: 'CPU Info',
    hoverinfo: 'label+percent+name',
    hole: .7,
    type: 'pie'
  }
}

  $.getJSON('/myapp/stats/cpus.json', function(json, textStatus) {
          console.log(json[0].per[0].type);
          // var label =[];
          // var values =[];

  //       var data = [defaultSetting({
  //   x: [0, .48],
  //   y: [0, .49]
  // }), defaultSetting({
  //   x: [0.52, 1],
  //   y: [0, .49]
  // })
  //       , defaultSetting({
  //   x: [0, .48],
  //   y: [.51, 1]
  // }), defaultSetting( {
  //   x: [0.52, 1],
  //   y: [0.52, 1]
  // })];
  var data = [defaultSetting({
x: [0, .48],
y: [0, .49]
}), defaultSetting({
x: [0.52, 1],
y: [0, .49]
})
  , defaultSetting({
x: [0, .48],
y: [.51, 1]
}), defaultSetting( {
x: [0.52, 1],
y: [0.52, 1]
})];
        var layout = {
          title: 'CPU info',
          annotations: [
            {
              font: {
                size: 14
              },
              showarrow: false,
              text: 'CPU1',
              x: 0.17,
              y: 0.5
            },{
                font: {
                  size: 20
                },
                showarrow: false,
                text: 'CPU2',
                x: 0.82,
                y: 0.5
              },{
                  font: {
                    size: 20
                  },
                  showarrow: false,
                  text: 'CPU3',
                  x: 0.82,
                  y: 0.5
                },{
                    font: {
                      size: 20
                    },
                    showarrow: false,
                    text: 'CPU4',
                    x: 0.82,
                    y: 0.5,

                    bgcolor : "#66b3ff"
                  }
          ],
          height: 400,
          width: 400,
        };
        for(var i in json) {
          $.each(json[i].per, (key, val)=>{
              data[i].values.push(val.used);
              data[i].labels.push(val.type);
          });
        }


        Plotly.newPlot('pie_chart', data, layout);
        });
});
