/*
var Docker = require('dockerode');
var fs     = require('fs');

var socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
var stats  = fs.statSync(socket);

if (!stats.isSocket()) {
  throw new Error('Are you sure the docker is running?');
}
var docker = new Docker({ socketPath: socket });

//Promise 선언
var _promise = function (docker) {

  var handler = function (value){
  //console.log(value);
    return Promise.resolve(value);

  };

  var p1 = new Promise(function (resolve, reject) {
      if (!docker) {
        reject(Error("실패!!"));
      }
      docker.listContainers({all: true}).then(handler).then(
          val => { resolve(val);}
      );
  });

  var p2 = new Promise(function (resolve, reject) {
    if (!docker) {
      reject(Error("실패!!"));
    }
    docker.listContainers({all: true}).then(handler).then(
        val => { resolve(val);}
    );
  });

  	return Promise.all([p1, p2]);
};

//Promise 실행
_promise(docker)
.then(function (text) {
	// 성공시
	console.log(text);
//  console.log(text[1]);
}, function (error) {
	// 실패시
	console.error(error);
});
*/
//var MongoClient = require('mongodb').MongoClient
//var Server = require('mongodb').Server;


/**
 * null 이나 빈값을 기본값으로 변경
 * @param str       입력값
 * @param defaultVal    기본값(옵션)
 * @returns {String}    체크 결과값
 */
/*
function nvl(str, defaultVal) {
    var defaultValue = "";

    if (typeof defaultVal != 'undefined') {
        defaultValue = defaultVal;
    }

    if (typeof str == "undefined" || str == null || str == '' || str == "undefined") {
        return defaultValue;
    }

    return str;
}

*/

/*
var p = require('./promise');
var docker = require('./docker');

var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/mydb');
var db = mongoose.connection; // 2
db.once('open', function callback () {
console.log("mongo db connection OK.");
});


p(docker).then(val => {
  //  console.log(val);

    a = val[0];
    tmp = a[0];

    var val1 = '{';
    var length = tmp.length -1;
    var b = Object.getOwnPropertyNames(tmp);
    */

/*
    for(key in tmp) {
       console.log(key + ' : \'' + tmp[key] + '\'');
        val1 += key + ' : \'' + tmp[key] + '\'';
        if(key ==  length) {
          list += '}'
          break;
        }
        val1 += ',';
    }
*/
/*
    console.log(typeof tmp);
    //console.log(typeof tmp);
    var b = Object.getOwnPropertyNames(tmp);
    var list ='{';
    var length = b.length -1;
    for(key in b){

      list += '"' + b[key] + '"' + ': "Schema.types.Mixed"' ;
      if(key ==  length) {
        list += '}'
        break;
      }
      list += ',';
    }
    //console.log(list);

    var obj = JSON.parse(list);
    var dataobj = JSON.stringify(tmp, 'null', ' ');
    console.log(dataobj);
//    var dataobj = JSON.parse(dataobj);
  //  console.log(dataobj);

   //console.log(obj);
    //console.log(JSON.parse(list));
    var dockerSchema = mongoose.Schema(obj);
    //console.log(dockerSchema);
    var TestModel =  mongoose.model("dockerSchema", dockerSchema);



    var testIns = new TestModel(dataobj);
    testIns.save(function(err) {
        if (err) throw err;
        console.log("Saved successfully");
    });

});
*/


var Docker = require('dockerode');
var fs     = require('fs');

var socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
var stats  = fs.statSync(socket);

if (!stats.isSocket()) {
  throw new Error('Are you sure the docker is running?');
}

var docker = new Docker({ socketPath: socket });
var optsc = {
  'Hostname': '',
  'User': '',
  'AttachStdin': true,
  'AttachStdout': true,
  'AttachStderr': true,
  'Tty': true,
  'OpenStdin': true,
  'StdinOnce': false,
  'Env': null,
  'Cmd': ['bash'],
  'Dns': ['8.8.8.8', '8.8.4.4'],
  'Image': 'ubuntu',
  'Volumes': {},
  'VolumesFrom': []
};

var previousKey,
    CTRL_P = '\u0010',
    CTRL_Q = '\u0011';

function handler(err, container) {
  var attach_opts = {stream: true, stdin: true, stdout: true, stderr: true};
  console.log(container);
  container.attach(attach_opts, function handler(err, stream) {
    // Show outputs
    stream.pipe(process.stdout);

    // Connect stdin
    var isRaw = process.isRaw;
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.setRawMode(true);
    process.stdin.pipe(stream);

    process.stdin.on('data', function(key) {
      // Detects it is detaching a running container
      if (previousKey === CTRL_P && key === CTRL_Q) exit(stream, isRaw);
      previousKey = key;
    });

    container.start(function(err, data) {
      resize(container);
      process.stdout.on('resize', function() {
        resize(container);
      });

      container.wait(function(err, data) {
        exit(stream, isRaw);
      });
    });
  });
}

// Resize tty
function resize (container) {
  var dimensions = {
    h: process.stdout.rows,
    w: process.stderr.columns
  };

  if (dimensions.h != 0 && dimensions.w != 0) {
    container.resize(dimensions, function() {});
  }
}

// Exit container
function exit (stream, isRaw) {
  process.stdout.removeListener('resize', resize);
  process.stdin.removeAllListeners();
  process.stdin.setRawMode(isRaw);
  process.stdin.resume();
  stream.end();
  process.exit();
}

docker.createContainer(optsc, handler);
