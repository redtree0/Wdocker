"use strict";


module.exports = function(dbRoute){
  var express = require('express');
  var router = express.Router();
  var docker = dbRoute.docker;
  var system = dbRoute.system;
  var auth = dbRoute.auth;
  var mongo = require("../js/mongoController");

  router.use(function timeLog(req, res, next) {
    // console.log('Time: ', Date.now());
    res.setHeader("Content-Type", "text/html");

    next();
  });

  router.post('/settings', function(req, res){
      if(req.body.ip === null || req.body.port === null){
        if(req.body.ip !== getServerIp()){
          res.render("settings.ejs");
          return false;
        }
      }else {
        var opts = {
          "ip" : req.body.ip,
          "port" :  req.body.port
        }
        mongo.docker.save(opts, res.render("settings.ejs"));
      }
  });

    router.post('/auth', function(req, res){
        if(req.body.user !== null && req.body.password !== null){
          mongo.auth.destroy(req,res);
          var opts = {
            "user" : req.body.user,
            "password" : req.body.password,
            "email" : req.body.email,
            "serveraddress" : "https://index.docker.io/v1/"
          };
          mongo.auth.save(opts, res.redirect("/myapp/settings"));
        }
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


    router.use(function timeLog(req, res, next) {
      console.log('Time: ', Date.now());
      res.setHeader("Content-Type", "application/json");

      next();
    });

  router.get('/settings/data.json', function(req,res){
        docker.find(function(err, db){
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(db);
        })
  });

  router.get('/auth/data.json', function(req,res){
        auth.find(function(err, db){
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(db);
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
