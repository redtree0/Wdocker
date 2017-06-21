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
/*

var docker = require('./docker');
//var network = require('./node_modules/dockerode/lib/network');
var Docker = require('dockerode');
//var Network = require('dockerode/lib/network');
var network = docker.getNetwork();
//var container = docker.getContainer("8ae57ffe64b7");

//new Network(modem = docker.modem);
//container.start();
console.log(network);
var ots ={
  "Name" : "multi-host",
  "Driver" : "bridge",
  "Internal" : false,
  "IPAM" : {
        "Driver": "default",
        "Config":
          [
              {
              "Subnet": "172.10.0.0/16",
              "IPRange": "172.10.10.0/24",
              "Gateway": "172.10.10.11"
              }
          ]
  }
};
console.log(ots);

//docker.createNetwork(ots);
var options = {
    id: "multi-host",
    Container: "xx",
    "EndpointConfig": {
        "IPAMConfig": {
        "IPv4Address": "172.10.10.50"
        }
      }
  };

//network.disconnect({id: "bridge", Container: "xx"}, (data, err) => {console.log(data); console.log(err);});
//network.connect(options, (data) => {console.log(data);});
*/
// var docker = require('./docker');
// var opts = {
//   term : "arm",
//   limit : "5",
//   filters : {}
// }
// opts["filters"] = {
//   "is-automated" : ["true"],
//   "is-official": ["true"]
// }
// console.log(typeof opts);
// console.log(opts);
// docker.searchImages(opts).then(
//   (val) =>{
//     console.log(val);
//   }
// ).catch(
//   (err) =>{
//     console.log(err);
//   }
// );
