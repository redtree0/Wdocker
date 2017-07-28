var docker = require("./docker")();

function successCallback(callback, data){
  console.log("successed");
  console.log(data);
  var result = {
    "state" : true,
    "msg" : data
  };
  callback(result);
}
function failureCallback(callback, data){
  console.log("failed");
  console.log(data);
  var error = {
      "state" : false ,
      "statusCode" : data.statusCode,
      "msg" : data.json.message
    }
  callback(error);
}

function dockerPromiseEvent(promiselist, callback) {
  Promise.all(promiselist).then(successCallback.bind(null, callback) , failureCallback.bind(null, callback));
}

var p = {
  "volume": {
    "get" : function (data, opts ,callback) {
     if(arguments.length == 2) {
       callback = opts;
       opts = null;
     }
       var list = [];
       console.log(data);
       for(var i in data) {
           var volume = docker.getVolume(data[i].Name);
           console.log(data);
           list.push( new Promise(function (resolve, reject) {
                 resolve(volume[callback](opts) );
           }));
         };
         return list;
       },
    "create" : function (data, callback) {
      docker.createVolume(data).then(successCallback.bind(null, callback) , failureCallback.bind(null, callback));

       },
    "remove" : function (data, callback) {
      var promiseList = p.volume.get(data, "remove");
      dockerPromiseEvent(promiseList, callback);
     //  docker.searchImages(filters).then(successCallback.bind(null, callback) , failureCallback.bind(null, callback));
    }
  },

  "image" : {
     "get" : function (data, opts ,callback) {
      if(arguments.length == 2) {
        callback = opts;
        opts = null;
      }
        var list = [];
        console.log(data);
        for(var i in data) {
            var image = docker.getImage(data[i].Id);
            console.log(data);
            list.push( new Promise(function (resolve, reject) {
                  resolve(image[callback](opts) );
            }));
          };
          return list;
        }
    ,
     "search" : function (filters, callback) {
       docker.searchImages(filters).then(successCallback.bind(null, callback) , failureCallback.bind(null, callback));
     },
     "remove" : function (data, callback) {
       var promiseList = p.image.get(data, "remove");
       dockerPromiseEvent(promiseList, callback);
      //  docker.searchImages(filters).then(successCallback.bind(null, callback) , failureCallback.bind(null, callback));
     },
     "create" : function (data,  callback) {
      //  progress,
       docker.createImage(data, callback);
     }
  },
  "network" : {
    "list" : function (filters, callback) {
      console.log(filters);
      console.log(callback);
      docker.listNetworks(filters).then(successCallback.bind(null, callback) , failureCallback.bind(null, callback));
    },
    "get" : function (data, opts ,callback) {
      if(arguments.length == 2) {
        callback = opts;
        opts = null;
      }
        var list = [];
        for(var i in data) {
            var network = docker.getNetwork(data[i].Id);
            console.log(callback);
            list.push( new Promise(function (resolve, reject) {
                  resolve(network[callback](opts) );
            }));
          };
          return list;
        }
    ,
    "create" : function (data, callback) {
      docker.createNetwork(data).then(successCallback.bind(null, callback) , failureCallback.bind(null, callback));
    },
    "remove" : function (data, callback) {
      var promiseList = p.network.get(data, "remove");
      dockerPromiseEvent(promiseList, callback);
    },
    "connect" : function (data, callback) {
      var opts = {Container: data.container, EndpointConfig : {NetworkID : (data[0])[0].Id}};
      var promiseList = p.network.get(data.lists, opts,"connect");
      dockerPromiseEvent(promiseList, callback);
    },
    "disconnect" : function (data, callback) {
      var opts = {Container: data[1]}
      var promiseList = p.network.get(data[0], opts,"disconnect");
      dockerPromiseEvent(promiseList, callback);
    },
  },
  "container" : {
    "create" : function (data, callback) {
      console.log(data);
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
