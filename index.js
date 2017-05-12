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


app.set('view engine', 'ejs');
//app.set('views', './views/partials');
app.engine('ejs', ejs.renderFile);

app.route('/')
  .get( (req, res) => { res.redirect('/myapp'); }
);

//var data = {list : 0};

var file = 'index';
var data = [];
app.route('/myapp')
    .get( (req, res) => {
        p(docker).then(val => {

            ptmp = val[0];

            ptmp.forEach(function (val, index) {
            //  console.log(JSON.stringify(val) + '|' + index);
                data.push(val);
            })
            console.log("data");
            console.log(data);

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

app.route('/myapp/:num')
    .get( (req, res) => {
      data.data = req.params.num;
      res.render(file, data);
    });

const port = 3000;
const server = app.listen(port, () => {
    console.log("Express server has started on port " + port);
});
const io = new SocketIo(server);
socketEvents(io, mongo);
