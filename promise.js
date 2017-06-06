// promise.js
var stream = require('stream');

function containerLogs(container) {

  // create a single stream for stdin and stdout
  var logStream = new stream.PassThrough();
  logStream.on('data', function(chunk){
    console.log(chunk);
  });

  container.logs({
    follow: true,
    stdout: true,
    stderr: true
  }, function(err, stream){
    if(err) {
      return logger.error(err.message);
    }
    container.modem.demuxStream(stream, logStream, logStream);
    stream.on('end', function(){
      logStream.end('!stop!');
    });
  });
}

function doIt(docker, opt, fn) {
  return new Promise(function (resolve, reject) {
      if (!docker && !opt) {
        reject(Error("실패!!"));
      }
      fn.then( val => {  //console.log(val);
        resolve(val); /*return val*/}  );
  });
}

function pMakelist(plist, fn) {
  console.log("===================");
  console.log("promise");
  console.log("===================");
//  console.log(fn);
  return plist.push(fn);
}
function ctlContainer (plist, docker, data, state) {
  data.forEach((container) => {
    if( container.State != state ) {
              pMakelist(plist , docker.getContainer(container.Id));
    }
  });
}
var _promise = function (docker, opt, data) {

var plist = [];
switch (opt) {
  case 'Container':
    pMakelist(plist ,doIt(docker, opt, docker.listContainers({all: true})));
  break;
  case 'network':
    pMakelist(plist ,doIt(docker, opt, docker.listNetworks({})));
    break;
  case 'image':
      pMakelist(plist ,doIt(docker, opt, docker.listImages()));
      break;
  case 'volume':
        pMakelist(plist ,doIt(docker, opt, docker.listVolumes({})));
        break;
  case 'CreateContainer':
      doIt(docker, opt, docker.createContainer(data));
      break;
  case 'dstart':
          ctlContainer(plist, docker, data, "running");
          break;
 case 'dstop':
          ctlContainer(plist, docker, data, "exited");
          break;
  case 'dremove':
              data.forEach((data) => {
                  if( data.State == "running" ) {
                      docker.getContainer(data.Id).stop();
                  }
                    pMakelist(plist ,docker.getContainer(data.Id));
                });

            break;
  }
//    console.log(p);
  	return Promise.all(plist);
};


module.exports = _promise;
