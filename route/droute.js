//./routes/droute.js

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
      result = pval[0];
      result.forEach(function (val, index) {
              data.push(val);
    });
    res.json(data);
  });
}
app.route('/myapp/container/data.json').get( (req, res) => {
    promiseTojson(p(docker, 'Container'), res);
})
app.route('/myapp/images/data.json').get( (req, res) => {
    promiseTojson(p(docker, 'image'), res);
});
app.route('/myapp/network/data.json').get( (req, res) => {
    promiseTojson(p(docker, 'network'), res);
});

app.route('/myapp/container')
        .get( (req, res) => {
          res.render("container");
        });
  app.route('/myapp/network')
          .get( (req, res) => {
            res.render("network");
          });

  app.route('/myapp/images')
    .get( (req, res) => {
      res.render("image");
    });

 app.route('/myapp/volume')
    .get( (req, res) => {
           res.render("volume");
    });

app.route('/myapp/test').get ( (req, res) => {
  res.render("test.ejs");
});

app.route('/myapp/graph').get ( (req, res) => {
  res.render("graph.ejs");
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
//  console.log(JSON.stringify(cpulist));
  res.json(cpulist);
});
	   return app;	//라우터를 리턴
};
