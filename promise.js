// promise.js
var stream = require('stream');

function doIt(docker, callback) {
  return new Promise(function (resolve, reject) {

      callback.then( val => {
        //  console.log(val);
         resolve(val);
        /*return val*/}  );
  });
}

function promisePush(plist, fn) {
  console.log("===================");
  console.log("promise");
  console.log("===================");
  console.log(fn);
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
  console.log("con");

    promisePush(plist ,doIt(docker, docker.listContainers({all: true})));
  break;
  case 'network':
    console.log("net");
    promisePush(plist ,doIt(docker, docker.listNetworks({})));
    break;
  case 'image':
      promisePush(plist ,doIt(docker, docker.listImages()));
      break;
  case 'volume':
        promisePush(plist ,doIt(docker, docker.listVolumes({})));
        break;
  case 'node':
        promisePush(plist ,doIt(docker, docker.listNodes()));
        break;
  case 'service':
        promisePush(plist ,doIt(docker, docker.listServices({})));
        break;
  case 'swarm':
        promisePush(plist ,doIt(docker, docker.swarmInspect()));
        break;
  case 'CreateContainer':
        doIt(docker, docker.createContainer(data));
        break;
  case 'CreateNetwork':
        // console.log(data);
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
