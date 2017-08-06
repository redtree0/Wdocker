"use strict";


module.exports = function(dbRoute){
  var express = require('express');
  var router = express.Router();
  var docker = dbRoute.docker;
  var system = dbRoute.system;
  var mongo = require("../mongoController");

  router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    res.setHeader("Content-Type", "text/html");

    next();
  });

  router.post('/settings', function(req, res){
  var db = new docker();
  console.log(db);
  db.ip = req.body.ip;
  db.port = req.body.port;
  // db.user =req.body.user;
  // db.password = req.body.password;
  // console.log(req);
  db.save(function(err){
          if(err){
              console.error(err);
              res.render("settings.ejs");
              return;
          }
          res.render("settings.ejs");
      });
    });
    function getServerIp() {
  			var os = require("os");
  			var ifaces = os.networkInterfaces();
  			var result = '';
  			for (var dev in ifaces) {
  					var alias = 0;
  					if(dev === "eth0"){
  						ifaces[dev].forEach(function(details) {
  							if (details.family == 'IPv4' && details.internal === false) {
  								result = details.address;
  								++alias;
  							}
  						});
  					}
  			}

  			return result;
  	}



      router.get('/swarm/system/data.json', function(req, res){
        mongo.system.show((data)=>{res.json(data)});
        // mongo.system.destroy(req,res);
      });

        // router.post('/swarm', function(req,res){
        //     var systemdb  = new system();
        //     var p = require("../p");
        //     console.log(req.body);
        //     if(req.body.swarmPort){
        //       var swarmPort = req.body.swarmPort;
        //       systemdb.swarmIP = getServerIp();
        //       systemdb.swarmPort = swarmPort;
        //     }
        //     // var swarmInit =new Promise(function(resolve, reject){
        //     //     resolve(p.swarm.create(swarmPort));
        //     //  });
        //     var opts = {
        //       "AdvertiseAddr" : getServerIp(),
        //       "ListenAddr" :   "0.0.0.0:"+ swarmPort,
        //       "ForceNewCluster" : true
        //     };
        //      var swarmInit = new Promise(function(resolve, reject){
        //        p.swarm.getToken().catch((err)=>{
        //          p.swarm.create(opts).then((data)=>{
        //            setTimeout(resolve, 3000, true);
        //          });
        //        });
        //      });


          //  var getToken  =   new Promise(function(resolve, reject){
          //    console.log("getToken");
          //       p.swarm.getToken().then((token)=>{
          //         console.log(token);
          //       systemdb.token.worker = (token.JoinTokens.Worker);
          //       systemdb.token.manager = (token.JoinTokens.Manager);
          //       resolve(true);
          //     }).catch((err)=>{
          //       console.log(err);
          //     });
          //   });
           //
          //   var dbRemove = new Promise(function(resolve, reject){
          //     console.log("remove");
          //     systemdb.remove({});
          //       resolve(true);

              // systemdb.remove({}, function(err){
              //   if(err) {
              //     console.log(error);
              //     reject(error);
              //     return console.log({ error: "database failure" });
              //   }
              //   resolve(true);
              //
              // });
            // });
            // var dbSave = new Promise(function(resolve, reject){
            //   systemdb.save(function(err){
            //     if(err){
            //       console.error(err);
            //       // res.render("settings.ejs");
            //       resolve(false);
            //       return;
            //     }
            //     resolve(true);
            //     // res.render("settings.ejs");
            //   });
            // });
            //
            // Promise.all([swarmInit, getToken, dbRemove, dbSave]).then((data)=>{
            //       res.render("swarm.ejs");
            // }).catch((err)=>{
            //
            //   // res.send({ err: err });
            //   console.log(err);
            //   res.render("swarm.ejs", { err: err });
            //
            //   console.log(err);
            // });
            // res.render("swarm.ejs");
            // p.swarm.getToken().then((token)=>{
            //   console.log(token);
            // });
            // // db.user =req.body.user;
            // // db.password = req.body.password;
            // // console.log(req);

          // });

    router.use(function timeLog(req, res, next) {
      console.log('Time: ', Date.now());
      res.setHeader("Content-Type", "application/json");

      next();
    });

  router.get('/settings/data.json', function(req,res){
        docker.find(function(err, books){
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(books);
        })
      });

  router.delete('/settings/:_id', function(req, res){
    // var db = new dockerDB();
    docker.remove({ _id: req.params._id }, function(err, output){
        if(err) return res.status(500).json({ error: "database failure" });

        /* ( SINCE DELETE OPERATION IS IDEMPOTENT, NO NEED TO SPECIFY )
        if(!output.result.n) return res.status(404).json({ error: "book not found" });
        res.json({ message: "book deleted" });
        */

        res.status(204).end();
    });


});

  return router;
};
