//index.js


var express = require('express'); // express
var bodyParser = require('body-parser'); // ajax - json
var path = require("path"); // 경로 경우의 수? a/ /b or a/b를 같게 ??
var ejs = require('ejs');
var SocketIo = require('socket.io');
var app = express();


var socketEvents  = require('./socket');
//var mongo = require('./mongo');

app.use(bodyParser.json());
app.use('/myapp', express.static(path.join(__dirname, 'public')));


app.set('view engine', 'ejs');
//app.set('views', './views/partials');
app.engine('ejs', ejs.renderFile);

app.route('/')
  .get( (req, res) => { res.redirect('/myapp'); }
);

var route = require('./route/droute.js')(app);
app.use('', route);


const port = 3000;
const server = app.listen(port, () => {
    console.log("Express server has started on port " + port);
});
const io = new SocketIo(server);
socketEvents(io);
