// promise.js

function doIt(docker, opt, fn) {
  return new Promise(function (resolve, reject) {
      if (!docker && !opt) {
        reject(Error("실패!!"));
      }
      fn.then( val => {  console.log(val); resolve(val); /*return val*/}  );
  });
}


var _promise = function (docker, opt, data) {

var p = [];
switch (opt) {
  case 'Container':
    p.push(doIt(docker, opt, docker.listContainers({all: true})));
  break;
  case 'network':
    p.push(doIt(docker, opt, docker.listNetworks({})));
    break;
  case 'image':
      p.push(doIt(docker, opt, docker.listImages()));
      break;
  case 'volume':
        p.push(doIt(docker, opt, docker.listVolumes({})));
        break;
  case 'CreateContainer':
      doIt(docker, opt, docker.createContainer(data));
      break;
  case 'StartContainer':
      data.forEach((data, index) => {
        if( data.state != "running" ) {
          console.log("start");
          docker.getContainer(data.id).start();
        }
      });
      break;
 case 'StopContainer':
          data.forEach((data, index) => {
            if( data.state == "running" ) {
              console.log("stop");
              docker.getContainer(data.id).stop();
            }
          });
          break;
  case 'RemoveContainer':
              data.forEach((data, index) => {
                if( data.state == "running" ) {
                  console.log("stop");
                  docker.getContainer(data.id).stop();
                }
              });

                data.forEach((data, index) => {
                  var testTime = setTimeout(()=>{docker.getContainer(data.id).remove()}, 2000);

                  console.log("remove");

                  //clearTimeout(testTime);

                });

              break;
}

//    console.log(p);
  	return Promise.all(p);
};


module.exports = _promise;
