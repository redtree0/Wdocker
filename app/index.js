//index.js
//////////////// EXPRESS SET UP ///////////////////////////////////////

var express = require('express'); // express
var bodyParser = require('body-parser');
var path = require("path");
var ejs = require('ejs');
var SocketIo = require('socket.io');
var app = express();

////////////////////////////////////////////////////////////////////////////

//////////////// WEBSOCKEFIY SET UP ///////////////////////////////////////

var websockify = require("nodev6-websockify");
var server  = require('https').Server(app);
var spawn   = require('child_process').spawn;
var fs      = require('fs');
var ws      = require('websocket').server;
var args    = require('yargs').argv;
// var path    = require('path')
// var port    = args.port || process.env.LINUX_DASH_SERVER_PORT || 3000

////////////////////////////////////////////////////////////////////////////

//////////////// SOCKET IO SERVICE ///////////////////////////////////////

var socketEvents  = require('./js/event');

////////////////////////// SECURETY //////////////////////////////
// app.use(express.urlencoded());
app.disable('x-powered-by'); //// 보안설청
/// 참고 http://expressjs.com/ko/advanced/best-practice-security.html
var session = require('express-session');
app.set('trust proxy', 1) // trust first proxy

app.use( session({
    genid: function(req) {
       return '_' + Math.random().toString(36).substr(2, 9);// use UUIDs for session IDs
   },
   secret: '@#@$MYSIGN#@$#$',
   resave: false,
   saveUninitialized: true,
   cookie: { secure: true }
  })
);
////////////////////////////////////////////////////////////////////////
const WEBPATH = '/myapp';

app.use(bodyParser.json()); // json
app.use(bodyParser.urlencoded({ extended: true }));


app.use(WEBPATH, express.static(path.join(__dirname, '/../public')));

app.set('views', path.join(__dirname, '/../views'));
app.set('view engine', 'ejs');
app.engine('ejs', ejs.renderFile);

app.route('/')
  .get( (req, res) => { res.redirect('/myapp/index'); }
);


//////////////////////// ROUTE /////////////////////////////////////////////////////
var web = require('./route/webRoute.js');
var json = require("./route/jsonRoute.js");

var dbLists = require("./js/mongo.js");
var dbRoute = require("./route/dbRoute.js")( dbLists );
app.use(WEBPATH, dbRoute);
app.use(WEBPATH, json);
app.use(WEBPATH, web);

//////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////// HTTP ///////////////////////////////////////////////
// const HTTP = 80;
// var http = require('http');
// var service = http.createServer(app).listen(HTTP, function(){
//   console.log("Http server listening on port " + HTTP);
// });
///////////////////////////////////////////////////////////////////////////////////


///////////////////////////// HTTPS //////////////////////////////////////////////


const HTTPS = 443;
var options = {
    key: fs.readFileSync('../key.pem'),
    cert: fs.readFileSync('../cert.pem')
};

var https = require('https');
var service = https.createServer(options, app).listen(HTTPS, function(){
  console.log("Https server listening on port " + HTTPS);
});
/////////////////////////////////////////////////////////////////////////////////


///////////////////////// SOCKET IO //////////////////////////////////////////////

// const PORT = 3000;
// const EXPRESS = server.listen(PORT, () => {
//     console.log("Express server has started on port " + PORT);
// });
// const SOCKET = new SocketIo(EXPRESS);
// socketEvents(SOCKET);

const SOCKET = new SocketIo(service);
socketEvents(SOCKET);


///////////////////////////////////////////////////////////////////////////////////



//////////////////////// WEBSOCKEFIY /////////////////////////////////////////////////
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
var local = getServerIp();

const websockifyConfig = {
  //   source: '192.168.0.108:9000',
  //   target: '192.168.0.108:5901',
  source: local + ':9000',
  target: local + ':5901',
  web : "../views/",
  cert: '../cert.pem',
  key: '../key.pem'
}
websockify(websockifyConfig);


///////////////////////////////////////////// LINUX_DASH /////////////////////////////////////////////
app.get('/websocket', function (req, res) {

  res.send({
    websocket_support: true,
  })

});

wsServer = new ws({
	httpServer: service
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
  if(request.resource === "/"){  /////// websocket 과 socketio 구분
    ///////// websocket 만 filter
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

///////////////////////////////////////////////////////////////////////////////////

///////////////////////// PAGE NOT FOUND //////////////////////////////////////////////
app.route('*')
  .get( (req, res) => {
    // console.log(req.originalUrl);
    if(req.originalUrl !== "/myapp/lib/js/angular-route.min.js.map"){
      res.render("404.ejs");
    }
});
///////////////////////////////////////////////////////////////////////////////////
