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
    if(req.body.ip === null || req.body.port === null){
      if(req.body.ip === getServerIp()){

      }else {
        res.render("settings.ejs");
        return false;
      }
    }
  var db = new docker();
  db.ip = req.body.ip;
  db.port = req.body.port;


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
