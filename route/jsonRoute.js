
  var express = require('express');
  var router = express.Router();

  var docker = require('../docker')();
  var p = require("../p");


  router.use(function timeLog(req, res, next) { /// 라우터 요정 왔을때 언제 도달했는지 확인
    console.log('Time: ', Date.now());  ///  시간 로깅
    res.setHeader("Content-Type", "application/json");  /// application/json 헤더 설정

    next(); /// 다음 라우터로 요청 넘김
  });


  /** @method  - resCallback
  *  @description
  *  @param {Object} res - Express res 객체
  *  @param {Object} opts -
  *  @param {Object} json - json
  *  @return {Object} res.json
  */
  function resCallback(res, opts, json){
    var data = null;

    if(arguments.length === 2) {
        json = opts;
        opts = null;
        data = json;
        console.log(data);
    }else {
       data = json[opts];
    }

    if( data === null ){
          data = false;
    }
    return  res.json(data);

  };


  router.get( '/container/data.json' , (req, res) => {
        p.container.getAllLists({all: true}, resCallback.bind(null, res));
  });

  router.get( '/network/data.json' , (req, res) => {
    console.log("network/data");
    res.setHeader("Content-Type", "application/json");  /// application/json 헤더 설정

        p.network.getAllLists({}, resCallback.bind(null, res));
  });

  router.get( '/image/data.json' , (req, res) => {
        p.image.getAllLists({}, resCallback.bind(null, res));
  });

  router.get( '/volume/data.json' , (req, res) => {
      p.volume.getAllLists({}, resCallback.bind(null, res, "Volumes"));
  });

  router.get( '/swarm/data.json' , (req, res) => {
    // p.swarm.getAllLists(null, resCallback.bind(null, res));
    docker.swarmInspect().then(resCallback.bind(null, res));
    // p.swarm.getAllLists({}, resCallback.bind(null, res));

    // promiseTojson(docker.swarmInspect(), res);
  });

  router.get( '/task/data.json' , (req, res) => {
    p.task.getAllLists({}, resCallback.bind(null, res));
  });

  router.get( '/task/data/:id' , (req, res) => {
    var id = req.params.id;
    p.task.inspect({id : id}, resCallback.bind(null, res));
  });

  router.get( '/node/data.json' , (req, res) => {
      p.node.getAllLists({}, resCallback.bind(null, res));
  });
  router.get( '/service/data.json' , (req, res) => {
    p.service.getAllLists({}, resCallback.bind(null, res));
  });

  router.get( '/service/data/:id' , (req, res) => {
    var id = req.params.id;
    p.service.getAllLists({id : id}, resCallback.bind(null, res));
  });


  router.get( '/container/stats/:id' , (req, res) => {
    var id = req.params.id;
    var p = require("../p");
    var promise = p.container.stats(id, resCallback.bind(null, res));
    // promise.then( (data)=>{res.json(data)});

  });

  router.get( '/container/top/:id' , (req, res) => {
    var id = req.params.id;
    var p = require("../p");
    var promise = p.container.top(id, resCallback.bind(null, res));
    // promise.then( (data)=>{res.json(data);});
  });

  router.get( '/container/logs/:id' , (req, res) => {
    // promiseTojson(docker.swarmInspect(), res);
    var id = req.params.id;
    var promise = (p.container.logs(id, (data)=>{res.json(data.msg);}));
    // console.log(id);

  });

  router.get( '/network/:id' , (req, res) => {
    var id = req.params.id;
    var filters = { "filters" : {
            id : [id]}
          };
    var promise = (p.network.list(filters));
    promise.then( (data)=>{ var json = data[0];  res.json(json);});

  });

  router.get( '/stats/data.json' , (req, res) => {
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

  router.get ('/stats/cpus.json', (req, res) => {
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


module.exports = router;
