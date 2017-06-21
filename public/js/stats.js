"use strict";

$(function () {

         setInterval(()=> {
           $.getJSON('/myapp/stats/data.json', function(json, textStatus) {
               var val =  json.data.usedmem / json.data.totalmem * 100;
               console.log(json);
               console.log(json.data.usedmem);
               console.log(json.data.totalmem);
               console.log(val);
                 gauge1.update(val);
           });

           $.getJSON('/myapp/stats/cpus.json', function(json, textStatus) {
          //    console.log(json);
              for(var i = 0, len = json.length; i < len; i++) {
//                  console.log(json[i]);
                      for(var type in json[i].per) {
                        console.log((json[i].per[0]));
                        gauge3.update((json[i].per[0].used));
                        console.log((json[i].per[1]));
                        console.log((json[i].per[2]));
                        console.log((json[i].per[3]));
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
            data = json;
            console.log(textStatus);
        });


        var width = 500,
  height = 500,
  radius = Math.min(width, height) / 2;
var color = d3.scale.ordinal()
  .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
var arc = d3.svg.arc()
  .outerRadius(radius - 10)
  .innerRadius(0);

// defines wedge size
// var pie = d3.layout.pie()
//     .sort(null)
//     .value(function (d) { return d.ratio; });
var pie = d3.layout.pie()
  .sort(null)
  .value(function (d) {
  return d.totalmem;
});

d3.json("/myapp/stats/data.json", function(error, data) {
console.log("d3");
console.log(data);

});

});
