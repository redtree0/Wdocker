//./routes/droute.js
"use strict";

module.exports = function(app){//함수로 만들어 객체 app을 전달받음
  var express = require('express');
  var app = express();
  var file = 'index';
  //var data = [];
  var p = require('../promise');
  var docker = require('../docker');

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
  callback.then(pval => {
      var data = [];

      var result = pval[0];
      console.log("result");
      console.log(typeof(result));
      for ( var i in result) {
        data.push(result[i]);
      }
    //   result.forEach(function (val, index) {
    //           data.push(val);
    // });
    res.json(data);
    result = new Array();
  });
}

app.route('/myapp/network/data.json').get( (req, res) => {
  res.setHeader("Content-Type", "application/json");
  promiseTojson(p(docker, 'network'), res);
});

app.route('/myapp/container/data.json').get( (req, res) => {
  res.setHeader("Content-Type", "application/json");
    promiseTojson(p(docker, 'Container'), res);
})
app.route('/myapp/images/data.json').get( (req, res) => {
  res.setHeader("Content-Type", "application/json");
    promiseTojson(p(docker, 'image'), res);
});

app.route('/myapp/node/data.json').get( (req, res) => {
  res.setHeader("Content-Type", "application/json");
    promiseTojson(p(docker, 'node'), res);
});
app.route('/myapp/service/data.json').get( (req, res) => {
  res.setHeader("Content-Type", "application/json");
  promiseTojson(p(docker, 'service'), res);
});

app.route('/myapp/swarm/data.json').get( (req, res) => {
  res.setHeader("Content-Type", "application/json");
  promiseTojson(p(docker, 'swarm'), res);
});

app.route('/myapp/container')
        .get( (req, res) => {

            console.log("'/myapp/container'");
          res.render("container.ejs");
        });
  app.route('/myapp/network')
          .get( (req, res) => {
            console.log("'/myapp/network'");
            res.render("network.ejs");
          });

  app.route('/myapp/images')
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

app.route('/myapp/dockerfile/data.json').get ( (req, res) => {
  var fs = require('fs');
  var path = require('path');
  var test = [];
  var jsonPath = path.join(__dirname);
  var dirPath = path.dirname(jsonPath)
  var dockerfilePath = path.join(dirPath, "dockerfile");
  console.log(jsonPath);;
  console.log(dirPath);
  fs.readdir(dockerfilePath, "utf8", function(err, file) {
    console.log(file);
    for (var i in file) {
        var readFilePath = path.join(dockerfilePath, file[i]);
        test.push(path.parse(readFilePath));
    }
      // var readFilePath = path.join(dockerfilePath, file[0]);
    //  fs.readFile(readFilePath, 'utf8', (err, data) => {
    //     if (err) throw err;
    //     console.log(data);
    //   });

    res.setHeader("Content-Type", "application/json");

     res.json(test);
  })

});

app.route('/myapp/stats/data.json').get ( (req, res) => {
  const os = require('os');
  //console.log(os);
  var data = {};
  data.hostname = os.hostname();
  data.cpus = os.cpus();
  data.networkInterfaces = os.networkInterfaces();
  data.platform = os.platform();
  data.release = os.release();
  // data.totalmem = os.totalmem();
  // data.freemem = os.freemem();
  // data.usedmem = data.totalmem - data.freemem;
  data.memory = {
    totalmem : os.totalmem(),
    freemem : os.freemem(),
    usedmem : os.totalmem() - os.freemem()
  }
  data.userInfo = os.userInfo();
  data.uptime = os.uptime();
  res.setHeader("Content-Type", "application/json");

  res.json(data);
});

app.route('/myapp/stats/cpus.json').get ( (req, res) => {
  var os = require('os');
  var cpus = os.cpus();
  var cpulist = [];
//  console.log(cpus);
  for(var i = 0, len = cpus.length; i < len; i++) {
    //  console.log("CPU %s:", i);
      var cpu = cpus[i], total = 0;

      for(var type in cpu.times) {
          total += cpu.times[type];
      }
      cpulist.push({cpu : "cpu" + i, per : []})[i];
      for(type in cpu.times) {
      //    console.log("\t", type, (100 * cpu.times[type] / total).toFixed(2));
          cpulist[i].per.push({type: type, used: (100 * cpu.times[type] / total).toFixed(2)});
      }
  }
  res.setHeader("Content-Type", "application/json");

  res.json(cpulist);
});


	   return app;	//라우터를 리턴
};
