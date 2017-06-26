// promise.js
var stream = require('stream');

function doIt(docker, callback) {
  return new Promise(function (resolve, reject) {
      // if (!docker) {
      //   reject(Error("실패!!"));
      // }
      callback.then( val => {
         resolve(val);
        /*return val*/}  );
  });
}

function promisePush(plist, fn) {
  console.log("===================");
  console.log("promise");
  console.log("===================");
//  console.log(fn);
  return plist.push(fn);
}
function ctlContainer (plist, docker, data, state) {
  data.forEach((container) => {
    if( container.State != state ) {
              promisePush(plist , docker.getContainer(container.Id));
    }
  });
}
var _promise = function (docker, opt, data) {
  if (!docker && !opt) {
      return new Promise(reject("args more request"));
   }
var plist = [];
switch (opt) {
  case 'Container':
    promisePush(plist ,doIt(docker, docker.listContainers({all: true})));
  break;
  case 'network':
    promisePush(plist ,doIt(docker, docker.listNetworks({})));
    break;
  case 'image':
      promisePush(plist ,doIt(docker, docker.listImages()));
      break;
  case 'volume':
        promisePush(plist ,doIt(docker, docker.listVolumes({})));
        break;
  case 'CreateContainer':
        doIt(docker, docker.createContainer(data));
        break;
  case 'CreateNetwork':
        console.log(data);
        doIt(docker, docker.createNetwork(data));
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
                    promisePush(plist ,docker.getContainer(data.Id));
                });

            break;

  }
//    console.log(p);
  	return Promise.all(plist);
};


module.exports = _promise;
