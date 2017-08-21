//index.js


var express = require('express'); // express
var bodyParser = require('body-parser'); // ajax - json
var path = require("path"); // 경로 경우의 수? a/ /b or a/b를 같게 ??
var ejs = require('ejs');
var SocketIo = require('socket.io');
var app = express();


var socketEvents  = require('./event');
//var mongo = require('./mongo');
var staticPath = '/myapp';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(staticPath, express.static(path.join(__dirname, 'public')));


app.set('view engine', 'ejs');
//app.set('views', './views/partials');
app.engine('ejs', ejs.renderFile);

app.route('/')
  .get( (req, res) => { res.redirect('/myapp/index'); }
);

var route = require('./route/droute.js');
var json = require("./route/jsonRoute.js");

var dbLists = require("./mongo.js");
var dbRoute = require("./route/dbRoute.js")( dbLists );
app.use(staticPath, route);
app.use(staticPath, json);
app.use(staticPath, dbRoute);


const port = 3000;
var websockify = require("nodev6-websockify");
websockify({
  source: '192.168.0.108:9000',
  target: '192.168.0.108:5901',
  web : "./views/"
});
const server = app.listen(port, () => {
    console.log("Express server has started on port " + port);
});
const io = new SocketIo(server);
socketEvents(io);
