
var _promise = function (docker) {
/*
  var handler = function (value){
  //console.log(value);
    return Promise.resolve(value);

  };
*/
  var p1 = new Promise(function (resolve, reject) {
      if (!docker) {
        reject(Error("실패!!"));
      }
      docker.listContainers({all: true}).then(
          val => {    resolve(val); }
      );
  });

  var p2 = new Promise(function (resolve, reject) {
    if (!docker) {
      reject(Error("실패!!"));
    }
    docker.listContainers({all: false}).then(
        val => { resolve(val);}
    );
  });

  	return Promise.all([p1]);
};

module.exports = _promise;
