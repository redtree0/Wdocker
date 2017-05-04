//index.js


var express = require('express'); // express
var bodyParser = require('body-parser'); // ajax - json
var path = require("path"); // 경로 경우의 수? a/ /b or a/b를 같게 ??
var ejs = require('ejs');
var SocketIo = require('socket.io');
var app = express();

var p = require('./promise');
var docker = require('./docker');
var socketEvents  = require('./socket');
var mongo = require('./mongo');

app.use(bodyParser.json());
app.use('/myapp', express.static(path.join(__dirname, 'public')));


app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

app.route('/')
  .get( (req, res) => { res.redirect('/myapp'); }
);

var data = {count : 0};

app.route('/myapp')
    .get( (req, res) => {
        p(docker).then(val => {
            //console.log(val);
            //data.count = JSON.stringify(val);
            res.render('test', data);
        });

    })
    .post( (req, res, next) => {
    //  console.log(req.body);
    //  console.log(JSON.stringify(req.body));
      data.count = req.body.message;
      //res.send(req.body);
      res.render('test', data);
    });

app.route('/myapp/:num')
    .get( (req, res) => {
      data.count = req.params.num;
      res.render('test', data);
    });

const port = 3000;
const server = app.listen(port, () => {
    console.log("Express server has started on port " + port);
});
const io = new SocketIo(server);
socketEvents(io, mongo);
