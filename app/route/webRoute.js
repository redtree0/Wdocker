//./routes/droute.js
"use strict";


  var express = require('express');
  var router = express.Router();

  router.use(function timeLog(req, res, next) {
    // console.log('Time: ', Date.now());

    res.setHeader("Content-Type", "text/html"); //// res type 지정
    next();
  });
  var path = require('path');


  router.get('/login', (req, res) => {
    res.render("login.ejs");
  });

  router.get('/logout', (req, res) => {
    var sess = req.session;
       if(sess.username){
           req.session.destroy(function(err){
               if(err){
                   console.log(err);
               }else{
                   res.redirect('/myapp/login');
               }
           })
       }else{
           res.redirect('/myapp/login');
       }
  });

  function checkSession(req, res, ejsFile){
    var sess = req.session;
    if(sess.userid === undefined || sess.userid === null){
      res.setHeader("Content-Type", "text/html");
      res.redirect('/myapp/login');
    }else {
      res.render(ejsFile);
    }
  }


  router.get('/index', (req, res) => {
      const EJS_File = "index.ejs";
      checkSession(req, res, EJS_File);
  });

  router.get('/container', (req, res) => {
    const EJS_File = "container.ejs";
    checkSession(req, res, EJS_File);
  });


  router.get('/network', (req, res) => {
    const EJS_File = "network.ejs";
    checkSession(req, res, EJS_File);
  });

  router.get('/image', (req, res) => {
    const EJS_File = "image.ejs";
    checkSession(req, res, EJS_File);
  });

  router.get('/volume', (req, res) => {
    const EJS_File = "volume.ejs";
    checkSession(req, res, EJS_File);
  });

  router.get('/swarm' , (req, res) => {
    const EJS_File = "swarm.ejs";
    checkSession(req, res, EJS_File);
  });

  router.get('/node', (req, res) => {
    const EJS_File = "node.ejs";
    checkSession(req, res, EJS_File);
  });

  router.get('/terminal' , (req, res) => {
    const EJS_File = "terminal.ejs";
    checkSession(req, res, EJS_File);
  });

  router.get('/dockerfile' ,  (req, res) => {
    const EJS_File = "dockerfile.ejs";
    checkSession(req, res, EJS_File);
  });

  router.get('/service' ,  (req, res) => {
    const EJS_File = "service.ejs";
    checkSession(req, res, EJS_File);
  });

  router.get('/task' ,  (req, res) => {
    const EJS_File = "task.ejs";
    checkSession(req, res, EJS_File);
  });
  //
  // router.get('/test' ,  (req, res) => {
  //       res.render("test.ejs");
  // });

  router.get('/settings' , (req, res) => {
    const EJS_File = "settings.ejs";
    checkSession(req, res, EJS_File);
  });

  router.get('/vnc' , (req, res) => {
    const EJS_File = "vnc.ejs";
    checkSession(req, res, EJS_File);
  });

  ////// html에서 외부 html 파일 로딩하기 위해  iframe 활용
  router.get('/vnc_core.ejs' , (req, res) => {
        res.render("./iframe/vnc_core.ejs");
  });

  ////// html에서 외부 html 파일 로딩하기 위해  iframe 활용
  router.get('/dashboard.ejs' , (req, res) => {
        res.render("./iframe/dashboard.ejs");
  });


module.exports = router;
