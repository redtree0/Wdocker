
  var express = require('express');
  var router = express.Router();

  var docker = require('../js/docker')();
  var p = require("../js/dockerEvent");


  router.use(function timeLog(req, res, next) { /// 라우터 요정 왔을때 언제 도달했는지 확인
    // console.log('Time: ', Date.now());  ///  시간 로깅
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
        // console.log(data);
    }else {
       data = json[opts];
    }

    if( data === null ){
          data = false;
    }
    return  res.json(data);

  };

  function failureCallback(res, err){
    console.log(err);
    return  res.json(err);
  }


  router.get( '/container/data.json' , (req, res) => {
        p.container.getAllLists({all: true}, resCallback.bind(null, res), failureCallback.bind(null, res));
  });

  router.get( '/network/data.json' , (req, res) => {
    res.setHeader("Content-Type", "application/json");  /// application/json 헤더 설정

        p.network.getAllLists({}, resCallback.bind(null, res), failureCallback.bind(null, res));
  });

  router.get( '/image/data.json' , (req, res) => {
        p.image.getAllLists({}, resCallback.bind(null, res), failureCallback.bind(null, res));
  });

  router.get( '/volume/data.json' , (req, res) => {
      p.volume.getAllLists({}, resCallback.bind(null, res, "Volumes"), failureCallback.bind(null, res));
  });

  router.get( '/swarm/data.json' , (req, res) => {
    p.swarm.getAllLists({}, resCallback.bind(null, res), failureCallback.bind(null, res));
  });

  router.get( '/task/data.json' , (req, res) => {
    p.task.getAllLists({}, resCallback.bind(null, res), failureCallback.bind(null, res));
  });

  router.get( '/task/data/:id' , (req, res) => {
    var id = req.params.id;
    p.task.inspect({id : id}, resCallback.bind(null, res), failureCallback.bind(null, res));
  });

  router.get( '/node/data.json' , (req, res) => {
      p.node.getAllLists({}, resCallback.bind(null, res), failureCallback.bind(null, res));
  });
  router.get( '/service/data.json' , (req, res) => {
    p.service.getAllLists({}, resCallback.bind(null, res), failureCallback.bind(null, res));
  });

  router.get( '/service/data/:id' , (req, res) => {
    var id = req.params.id;
    p.service.getAllLists({id : id}, resCallback.bind(null, res), failureCallback.bind(null, res));
  });


  router.get( '/container/stats/:id' , (req, res) => {
    var id = req.params.id;
    var p = require("../p");
    var promise = p.container.stats(id, resCallback.bind(null, res), failureCallback.bind(null, res));
    // promise.then( (data)=>{res.json(data)});

  });

  router.get( '/container/top/:id' , (req, res) => {
    var id = req.params.id;
    var p = require("../p");
    var promise = p.container.top(id, resCallback.bind(null, res), failureCallback.bind(null, res));
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
    var promise = (p.network.getAllLists(filters));
    promise.then( (data)=>{ var json = data[0];  res.json(json);});

  });

module.exports = router;
