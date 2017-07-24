//./routes/droute.js
"use strict";


module.exports = function(app){//함수로 만들어 객체 app을 전달받음
  var express = require('express');
  var app = express();
  var file = 'index';
  //var data = [];
  var p = require('../promise');
  var docker = require('../docker')();

  app.route('/myapp/index')
      .get( (req, res) => {
              res.render(file);
      })
      .post( (req, res, next) => {
      //  console.log(req.body);
      //  console.log(JSON.stringify(req.body));
        data.list = req.body.message;
        //res.send(req.body);
        res.render(file, data);
      });

    function promiseTojson(callback, res){
        callback.then( (resultJson) => {
          res.setHeader("Content-Type", "application/json");
          res.json(resultJson);
        });
      }

function getPromise(callback) {
  return new Promise(function (resolve, reject) {

      callback.then( (val) => {
         console.log(val);
         resolve(val);
        });
  });
}
function convertStringToBoolean(json){
  for( var i in json) {
    if(json[i] == "true") {
      var attr = i;
      json[attr] =  true;
    } else   if(json[i] == "false") {
      var attr = i;
      json[attr] =  false;
    }
  }
}

app.route('/myapp/container')
        .get( (req, res) => {
          res.render("container.ejs");
        })


  app.route('/myapp/network')
          .get( (req, res) => {
            res.render("network.ejs");
          });

  app.route('/myapp/image')
    .get( (req, res) => {
      res.render("image.ejs");
    });

 app.route('/myapp/volume')
    .get( (req, res) => {
           res.render("volume.ejs");
    });
    app.route('/myapp/swarm')
       .get( (req, res) => {
              res.render("swarm.ejs");
       });

  app.route('/myapp/node')
    .get( (req, res) => {
      res.render("node.ejs");
  });
app.route('/myapp/test').get ( (req, res) => {
  res.render("test.ejs");
});

app.route('/myapp/graph').get ( (req, res) => {
  res.render("graph.ejs");
});
app.route('/myapp/dockerfile').get ( (req, res) => {
  res.render("dockerfile.ejs");
});
app.route('/myapp/service').get ( (req, res) => {
  res.render("service.ejs");
});



	   return app;	//라우터를 리턴
};
