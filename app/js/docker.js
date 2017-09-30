
var Docker = require('dockerode');
var fs     = require('fs');
var path = require("path");

module.exports = function(opts) {

  ////// socket 변수 지정
  var socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';

  ///// docker ps 운용 중인지 확인
  var stats  = fs.statSync(socket);
  if (!stats.isSocket()) {
    throw new Error('Are you sure the docker is running?');
  }

  var state = false;

  // args 가 0 일때 default docker
  if( arguments.length === 0 ){
    state = false;
  }
  // args 가 1 일때 custom docker
   else if( arguments.length === 1 ){
    // opts 가 object 인지 확인
    if(typeof opts === "object") {
      // opts 가 object 이면 json key 값 host, port 확인
      // if("host" in opts && "port" in opts) {
        state = true;
      // }
    }
      // opt가 object가 아닌 다른 타입인지 확인 아닐 경우 false 반환
      else if(typeof opts !== "object") {
        return new Boolean(false);
      }
  }
  var dockerPath = path.join(path.dirname(__dirname), "docker");
  if(!fs.existsSync(dockerPath)){
    fs.mkdir(dockerPath, function(err) {
    });
  }
  if(state) {
    var keydir = null;
    if(opts.hasOwnProperty("host")){
      keydir = path.join(dockerPath, opts.host);
    }
    if(fs.existsSync(keydir)){
      opts.protocol = 'https';
      opts.ca = fs.readFileSync(keydir + '/ca.pem');
      opts.cert = fs.readFileSync(keydir + '/cert.pem');
      opts.key = fs.readFileSync(keydir + '/key.pem');
    }
    // console.log(opts);
    var docker = new Docker(opts);
    // console.log("In Docker");
    // console.log(docker);
  } else {
    var docker = new Docker({ socketPath: socket });
  }

  return docker;
}
