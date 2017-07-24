module.exports = function(app){//함수로 만들어 객체 app을 전달받음
  var express = require('express');
  var app = express();

  var docker = require('../docker')();

  function promiseTojson(callback, res){
    callback.then( (resultJson) => {
      res.setHeader("Content-Type", "application/json");
      res.json(resultJson);
    });
  }

  app.route('/myapp/network/data.json').get( (req, res) => {
    promiseTojson(docker.listNetworks({}), res);
  });

  app.route('/myapp/container/data.json').get( (req, res) => {
      promiseTojson(docker.listContainers({all: true}), res);
  })
  app.route('/myapp/image/data.json').get( (req, res) => {
      promiseTojson(docker.listImages(), res);
  });

  app.route('/myapp/node/data.json').get( (req, res) => {
      promiseTojson(docker.listNodes(), res);
  });
  app.route('/myapp/service/data.json').get( (req, res) => {
    promiseTojson(docker.listServices({}), res);
  });

  app.route('/myapp/swarm/data.json').get( (req, res) => {
    promiseTojson(docker.swarmInspect(), res);
  });

  app.route('/myapp/container/stats/:id').get( (req, res) => {
    // promiseTojson(docker.swarmInspect(), res);
    var id = req.params.id;
    var p = require("../p");
    var promise = (p.container.stats(id, (data)=>{res.json(data);}));

  });

  app.route('/myapp/container/top/:id').get( (req, res) => {
    // promiseTojson(docker.swarmInspect(), res);
    var id = req.params.id;
    var p = require("../p");
    var promise = (p.container.top(id, (data)=>{res.json(data.msg);}));
    // res.setHeader("Content-Type", "application/json");

  });

  app.route('/myapp/container/logs/:id').get( (req, res) => {
    // promiseTojson(docker.swarmInspect(), res);
    var id = req.params.id;
    var p = require("../p");
    var promise = (p.container.logs(id, (data)=>{res.json(data.msg);}));
    // console.log(id);

  });

  app.route('/myapp/network/:id').get( (req, res) => {
    // promiseTojson(docker.swarmInspect(), res);
    var id = req.params.id;
    var p = require("../p");
    var filters = { "filters" : {
            id : [id]}
          };
    var promise = (p.network.list(filters, (data)=>{res.json(data.msg[0]);}));

  });

  app.route('/myapp/dockerfile/data.json').get ( (req, res) => {
    var fs = require('fs');
    var path = require('path');
    var test = [];
    var jsonPath = path.join(__dirname);
    var dirPath = path.dirname(jsonPath)
    var dockerfilePath = path.join(dirPath, "dockerfile");
    console.log(jsonPath);
    console.log(dirPath);
    fs.readdir(dockerfilePath, "utf8", function(err, file) {
      console.log(file);
      for (var i in file) {
          var readFilePath = path.join(dockerfilePath, file[i]);
          test.push(path.parse(readFilePath));
      }


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

  return app;
}
