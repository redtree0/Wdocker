//./routes/p1.js
module.exports = function(app){//함수로 만들어 객체 app을 전달받음
  var express = require('express');
  var app = express();
  var file = 'index';
  var data = [];
  var p = require('../promise');
  var docker = require('../docker');

  app.route('/myapp')
      .get( (req, res) => {
          p(docker, 'Container').then(val => {
              // promise 중 몇번째 promise
              ptmp = val[0];

              // promise 몇번째 promise 내에 몇번째 data 추출
              ptmp.forEach(function (val, index) {
              //  console.log(JSON.stringify(val) + '|' + index);
                  data.push(val);
              })


              // 렌더링
              res.render(file, {data});

              data=new Array();
          });

      })
      .post( (req, res, next) => {
      //  console.log(req.body);
      //  console.log(JSON.stringify(req.body));
        data.list = req.body.message;
        //res.send(req.body);
        res.render(file, data);
      });


  app.route('/myapp/network')
          .get( (req, res) => {
            p(docker, 'network').then(val => {
                ptmp = val[0];

                ptmp.forEach(function (val, index) {
                //  console.log(JSON.stringify(val) + '|' + index);
                    data.push(val);
                })


                res.render("network", {data});
                data=new Array();
            });
          });


          app.route('/myapp/image')
                  .get( (req, res) => {
                    p(docker, 'image').then(val => {
                        ptmp = val[0];

                        ptmp.forEach(function (val, index) {
                        //  console.log(JSON.stringify(val) + '|' + index);
                            data.push(val);
                        })


                        res.render("image", {data});
                        data=new Array();
                    });
                  });


                  app.route('/myapp/volume')
                          .get( (req, res) => {
                            p(docker, 'volume').then(val => {
                                ptmp = val[0];
                                console.log(ptmp);

                                console.log(data);

                                res.render("volume", {data});
                                data=new Array();
                            });
                          });
	return app;	//라우터를 리턴
};
