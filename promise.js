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

  case 'CreateContainer':
        p.create.container(data);
        break;
  case 'CreateNetwork':
        p.create.network(data);
        break;
  case 'StartContainer':
  p.start.container(data);

          break;
 case 'StopContainer':
    p.stop.container(data);
          break;
  case 'RemoveContainer':
          p.remove.container(data);

            break;

  }
//    console.log(p);
  	return Promise.all(plist);
};


module.exports = _promise;
