"use strict";


module.exports = function(dbRoute){


  var express = require('express');
  var router = express.Router();
  var docker = dbRoute.docker;

  var admin = dbRoute.admin;
  var mongo = require("../js/mongoController");

  var os = require("os");
  function getServerIp() {
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

  router.use(function timeLog(req, res, next) {
    // console.log('Time: ', Date.now());
    res.setHeader("Content-Type", "text/html");

    next();
  });



  router.get('/admin/data', function(req,res){
        var sess = req.session;
        if(sess.userid === undefined || sess.userid === null){
          // console.log("not seesion");
          return res.json(false);
        }
        if(req.body.cpass === req.body.pass){

            var opts = {
              "username" : sess.username,
              "password" : sess.password,
            }

            mongo.admin.find(opts, (match)=>{
              // console.log(match);
              if(match){
                opts.auth = match.auth;
                res.json(opts);
              }else {
                res.json(false);
              }
            });
          // res.json(true);
        }
  });

  router.post('/admin/data', function(req,res){
    if(req.body.username !== null && req.body.password !== null){
      if(mongo.admin !== undefined){
        mongo.admin.count((cnt)=>{
          if(cnt === 0){
            var defaultID = {
              "username" : "admin",
              "password" : "admin"
            }
            mongo.admin.save(defaultID);
            }
          });
        }
        var opts = {
          "username" : req.body.username,
          "password" : req.body.password
        }
        // console.log(opts);
        return mongo.admin.find(opts, (match)=>{
          if(match){
            var sess = req.session;
            sess.userid = '_' + Math.random().toString(36).substr(2, 9);

            sess.username = match.username;
            sess.password = match.password;
            console.log("user login %s", match.username);
            res.json(true);
          }else {
            res.json(false);
          }
        });
      }

  });

  router.post('/admin/new', function(req,res){
      if(req.body.username !== null && req.body.password !== null){
            var opts = {
              "username" : req.body.username,
              "password" : req.body.password
            }
            // console.log("do");
            mongo.admin.save(opts);
            res.json(true);

      }else {
        res.json(false);
      }

  });

  router.post('/admin/update', function(req,res){
    var sess = req.session;
    if(sess.userid === undefined || sess.userid === null){
      // return res.json(false);
      return  res.redirect("/myapp/settings");
    }
    if(req.body.cpass !== null && req.body.pass !== null){
            if(req.body.cpass === req.body.pass){

              var opts = {
                "username" : sess.username,
                "password" : req.body.cpass
              }
              var filter = {
                "username" : sess.username,
                "password" : sess.password
              }
              // console.log(opts);
              mongo.admin.update(filter,opts, (data)=>{
                if(data){
                  return res.redirect("/myapp/login");
                }
              });
              // res.json(true);
            }

      }else {
        return  res.redirect("/myapp/settings");
      }

  });


  router.post('/admin/update/auth', function(req,res){
          var sess = req.session;
          if(sess.userid === undefined || sess.userid === null){
            return  res.redirect("/myapp/settings");
          }
          if(req.body.username !== null && req.body.password !== null && req.body.email !== null){
                    var opts = {
                      "username" : req.body.username,
                      "password" : req.body.password,
                      "email" : req.body.email,
                      "serveraddress" : "https://index.docker.io/v1/"
                    }
                    var filter = {
                      "username" : sess.username,
                      "password" : sess.password
                    }
                    // console.log(opts);
                    mongo.admin.update(filter,opts, "auth",(data)=>{
                      if(data){
                        return res.redirect("/myapp/settings");
                      }
                    });
                    // res.json(true);
                  }
            else {
              return  res.redirect("/myapp/settings");
            }

        });


    var docker = mongo.docker;
    router.post('/settings/data', function(req, res){
           if(req.body.ip === null || req.body.port === null){
             if(req.body.ip !== getServerIp()){

               return res.render("settings.ejs");
             }
           }else {
             var opts = {
               "ip" : req.body.ip,
               "port" :  req.body.port
             }

             docker.save(opts, res.redirect("/myapp/settings"));
           }
   });


  router.use(function timeLog(req, res, next) {
       // console.log('Time: ', Date.now());
       res.setHeader("Content-Type", "application/json");

       next();
  });



  router.get('/settings/data.json', function(req,res){
        docker.count((cnt)=>{
              if(cnt === 0){
                var defaultHost = {
                  "ip" : getServerIp(),
                  "port" : null
                }
                docker.save(defaultHost, docker.show((json)=>{res.json(json)}));
              }else {
                docker.show((json)=>{res.json(json)});
              }
          });
  });


  return router;
};
