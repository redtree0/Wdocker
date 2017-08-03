"use strict";


module.exports = function(dockerDB){
  var express = require('express');
  var router = express.Router();


  router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    res.setHeader("Content-Type", "text/html");

    next();
  });

  router.post('/settings', function(req, res){
  var db = new dockerDB();
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

    router.use(function timeLog(req, res, next) {
      console.log('Time: ', Date.now());
      res.setHeader("Content-Type", "application/json");

      next();
    });

  router.get('/settings/data.json', function(req,res){
        dockerDB.find(function(err, books){
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(books);
        })
      });

  router.delete('/settings/:_id', function(req, res){
    // var db = new dockerDB();
    dockerDB.remove({ _id: req.params._id }, function(err, output){
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
