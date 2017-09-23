
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


  var mongo = require("../js/mongoController");
  function myPromise(hostId, callback){
    new Promise(function(resolve, reject){
      mongo.docker.show(resolve)
    }).then((data)=>{

          var hostinfo = data.filter((value)=>{
            if(value._id.toString() === hostId){
              return value.ip;
            }
          });
          var host = hostinfo[0].ip;
          // callback(host);
          callback(host);
    })
  };

  function getDockerJSON( host, dockerType, res, opts){
    p[dockerType].getTaskDocker(host, (docker)=>{
      if(docker){

        var config = {};
        // console.log(docker);

        if(opts !== undefined){
          // console.log(opts);
          if(opts.hasOwnProperty("config") && opts.config !== null){
              config = opts.config;
          }
          if(opts.hasOwnProperty("res") && opts.res !== null){
            p[dockerType].getAllLists(config, resCallback.bind(null, res, opts.res), failureCallback.bind(null, res), docker);
          }else {
            p[dockerType].getAllLists(config, resCallback.bind(null, res), failureCallback.bind(null, res), docker);
          }
        }else {
            p[dockerType].getAllLists(config, resCallback.bind(null, res), failureCallback.bind(null, res), docker);
          }

        // }

      }else {
        res.json(true);
      }
    });
  };


  router.get( '/container/data/:host' , (req, res) => {

          var hostId = req.params.host;
          myPromise(hostId , (host)=>{
            var opts = {
              config : {all : true}
            };
            getDockerJSON( host, "container", res, opts);
          });


  });

  router.get( '/network/data/:host' , (req, res) => {

        var hostId = req.params.host;
        myPromise(hostId , (host)=>{

              getDockerJSON( host, "network", res);
        });

  });

  router.get( '/image/data/:host' , (req, res) => {

        var hostId = req.params.host;
        myPromise(hostId , (host)=>{

              getDockerJSON( host, "image", res)
        });

  });

  router.get( '/volume/data/:host' , (req, res) => {

        var hostId = req.params.host;
        myPromise(hostId , (host)=>{
          var opts = {
            res : "Volumes"
          }
              getDockerJSON( host, "volume", res, opts)
        });

  });

  router.get( '/swarm/data.json' , (req, res) => {
    p.swarm.getAllLists({}, resCallback.bind(null, res), failureCallback.bind(null, res));
  });

  router.get( '/task/data.json' , (req, res) => {
    p.task.getAllLists({}, resCallback.bind(null, res), failureCallback.bind(null, res));
  });

  router.get( '/task/data/:host' , (req, res) => {

    var hostId = req.params.host;
    myPromise(hostId , (host)=>{
          getDockerJSON( host, "task", res)
    });

  });


  router.get( '/node/data/:host' , (req, res) => {

        var hostId = req.params.host;
        myPromise(hostId , (host)=>{
              getDockerJSON( host, "node", res)
        });

  });

  router.get( '/service/data/:host' , (req, res) => {

    var hostId = req.params.host;
    myPromise(hostId , (host)=>{
      // console.log(host);
          getDockerJSON( host, "service", res)
    });
  });

  router.get( '/admin/data/' , (req, res) => {

    var sess = req.session;
    if(sess.userid === undefined || sess.userid === null){
      return res.json(false);
    }else {
      var sessUser = {
        username : sess.username,
        password : sess.password
      }
      return res.json(sessUser);
    }
  });


module.exports = router;
