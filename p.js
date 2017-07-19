var docker = require("./docker")();



function successCallback(callback, data){
  console.log("successed");
  console.log(data);
  var result = {
    "state" : true,
    "msg" : data
  }
  callback(result);
}
function failureCallback(callback, data){
  console.log("failed");
  console.log(data);
  var error = {
      "state" : false ,
      "msg" : data.json.message
    }
  callback(error);
}

function dockerPromiseEvent(promiselist, callback) {
  Promise.all(promiselist).then(successCallback.bind(null, callback) , failureCallback.bind(null, callback));
}

var p = {
  "network" : {
    "create" : function (data, callback) {
      docker.createNetwork(data).then(successCallback.bind(null, callback) , failureCallback.bind(null, callback));
    }
  },
  "container" : {
    "create" : function (data, callback) {
        docker.createContainer(data).then(successCallback.bind(null, callback) , failureCallback.bind(null, callback));
    },
    "get" : function (data, callback) {
        var list = [];
        for(var i in data) {
            var container = docker.getContainer(data[i].Id);
            console.log(callback);
            list.push( new Promise(function (resolve, reject) {
                  resolve(container[callback]() );
            }));
          };
          return list;
        }
    ,
    "start" :  function (data, callback) {
      var promiseList = p.container.get(data, "start");
      dockerPromiseEvent(promiseList, callback);
    },

    "stop" :  function (data, callback) {
      var promiseList = p.container.get(data, "stop");
        dockerPromiseEvent(promiseList, callback);
    },

    "remove" :  function (data, callback) {
      var promiseList = p.container.get(data, "remove");
        dockerPromiseEvent(promiseList, callback);
    },

    "kill" :  function (data, callback) {
      var promiseList = p.container.get(data, "kill");
        dockerPromiseEvent(promiseList, callback);
    },
    "getArchive" : function (data, callback) {
      var promiseList = p.container.get(data, "getArchive");
        dockerPromiseEvent(promiseList, callback);
    },
    "pause" : function (data, callback) {
      var promiseList = p.container.get(data, "pause");
        dockerPromiseEvent(promiseList, callback);
    },
    "unpause" : function (data, callback) {
      var promiseList = p.container.get(data, "unpause");
        dockerPromiseEvent(promiseList, callback);
    },
    "stats" : function (data, callback) {
      var container = docker.getContainer(data);
      console.log(container);
      // container.stats().then((data)=>{console.log(data);});
      return new Promise(function (resolve, reject) {
          resolve(container.stats({"stream": false}));
      });
    },
    "top" : function (data, callback){
      var container = docker.getContainer(data);
      return new Promise(function (resolve, reject) {
          resolve(container.top ({"ps_args": "aux"}));
      });
    },
    "logs" : function (data, callback){
      var container = docker.getContainer(data);
      return new Promise(function (resolve, reject) {
        //  "follow" : true, , "stderr": true
        container.logs ({ "stdout" : true}).then((data)=>{
          console.log(data);
        });
          resolve(container.logs ({ "stdout" : true}));
      });
    }

  }

}


module.exports = p;
