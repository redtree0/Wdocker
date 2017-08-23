//index.js


var express = require('express'); // express
var bodyParser = require('body-parser'); // ajax - json
var path = require("path"); // 경로 경우의 수? a/ /b or a/b를 같게 ??
var ejs = require('ejs');
var SocketIo = require('socket.io');
var app = express();


var socketEvents  = require('./js/event');
//var mongo = require('./mongo');

var staticPath = '/myapp';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(staticPath, express.static(path.join(__dirname, '/../public')));

app.set('views', path.join(__dirname, '/../views'));
app.set('view engine', 'ejs');
app.engine('ejs', ejs.renderFile);

app.route('/')
  .get( (req, res) => { res.redirect('/myapp/index'); }
);

var route = require('./route/droute.js');
var json = require("./route/jsonRoute.js");

var dbLists = require("./js/mongo.js");
var dbRoute = require("./route/dbRoute.js")( dbLists );
app.use(staticPath, dbRoute);
app.use(staticPath, json);
app.use(staticPath, route);

const port = 3000;
var websockify = require("nodev6-websockify");
websockify({
  source: '192.168.0.108:9000',
  target: '192.168.0.108:5901',
  web : "../views/"
});



// var path    = require('path')
var server  = require('http').Server(app)
var spawn   = require('child_process').spawn
var fs      = require('fs')
var ws      = require('websocket').server
var args    = require('yargs').argv
// var port    = args.port || process.env.LINUX_DASH_SERVER_PORT || 3000


app.get('/websocket', function (req, res) {

  res.send({
    websocket_support: true,
  })

});

wsServer = new ws({
	httpServer: server
});
var nixJsonAPIScript = __dirname + '/linux_json_api.sh'

function getPluginData(pluginName, callback) {
  var command = spawn(nixJsonAPIScript, [ pluginName, '' ])
  var output  = []

  command.stdout.on('data', function(chunk) {
    output.push(chunk.toString());
  })

  command.on('close', function (code) {
    callback(code, output);

  })
}

wsServer.on('request', function(request) {
  // console.log(Object.keys(request));
  // console.log(request.resource);
  if(request.resource === "/"){

    var wsClient = request.accept('', request.origin)

    wsClient.on('message', function(wsReq) {

      var moduleName = wsReq.utf8Data
      var sendDataToClient = function(code, output) {
        if (code === 0) {
          var wsResponse = '{ "moduleName": "' + moduleName + '", "output": "'+ output.join('') +'" }'
          wsClient.sendUTF(wsResponse)
        }
      }
      getPluginData(moduleName, sendDataToClient)

    })
  }

})

app.get('/server/', function (req, res) {

	var respondWithData = function(code, output) {
		if (code === 0) res.send(output.toString())
		else res.sendStatus(500)
	}
  getPluginData(req.query.module, respondWithData)
})

app.route('*')
  .get( (req, res) => {
    // console.log(req.originalUrl);
    if(req.originalUrl !== "/myapp/lib/js/angular-route.min.js.map"){
      res.render("404.ejs");
    }
});

const node = server.listen(port, () => {
    console.log("Express server has started on port " + port);
});
const io = new SocketIo(node);
socketEvents(io);
