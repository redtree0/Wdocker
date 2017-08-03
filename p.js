

  var p = function( docker){
    this.docker = docker;
    this.getInfo = null;
    this.getLists = null;
    this.remoteDocket = null;
  };


  p.prototype.successCallback = function (callback, data){
      console.log("successed");
      console.log(data);
      var result = {
        "state" : true,
        "msg" : data
      };
      return callback(result);
    }
  p.prototype.failureCallback = function (callback, data){
      console.log("failed");
      console.log(data);
      var error = {
          "state" : false ,
          "statusCode" : data.statusCode,
          "msg" : data.json.message
        }
      return callback(error);
    }

    p.prototype.get = function (data, opts, method) {
      if(arguments.length === 2) {
        method = opts;
        opts = null;
      }
      var list = [];
      console.log("p get ");
      console.log(data);
      console.log(method);
      for(var i in data) {
        var dockerInfo = docker[this.getInfo](data[i].Id);
        list.push( new Promise(function (resolve, reject) {
          resolve(dockerInfo[method](opts) );
        }));
      };
      return list;
    };

  p.prototype.dockerPromiseEvent = function(promiselist, callback) {
      Promise.all(promiselist).then(this.successCallback.bind(null, callback) , this.failureCallback.bind(null, callback));
  }

  p.prototype.doTask = function(data, callback, opts, task){
    var self = this ;
    console.log(self.getInfo);
    if(arguments.length === 3){
      task = opts;
      opts = null;
      console.log("doTask");
      console.log(task);
      console.log(opts);
      var promiseList = self.get(data, task);
    }else {
      var promiseList = self.get(data, opts, task);
    }
    self.dockerPromiseEvent(promiseList, callback);
  };

  p.prototype.getAllLists = function (opts, callback){
    var dockerInfo = docker[this.getLists](opts);
    console.log("getlists");
    console.log(this.getLists);
    return new Promise(function(resolve, reject){
      resolve(dockerInfo);
    }).then(callback);

  }

  var docker = require("./docker")();

  var test = new p(docker);

   var container = Object.create(test);

   container.getInfo = "getContainer";
   container.getLists = "listContainers";

   container.create = function (data, callback) {
     var self = this;
       (self.docker).createContainer(data).then(self.successCallback.bind(null, callback) , self.failureCallback.bind(null, callback));
   }

   container.start  = function (data, callback) {
    //  var opts = {"detachKeys" : "ctrl-d"};
     this.doTask(data, callback, "start");
   }

   container.stop =  function (data, callback) {
     this.doTask(data, callback, "stop");
   }

   container.remove = function (data, callback) {
     this.doTask(data, callback, "remove");
   }
   //
   container.kill = function (data, callback) {
     this.doTask(data, callback, "kill");
   }
   container.getArchive = function (data, callback) {
     this.doTask(data, callback, "getArchive");
   }
    container.pause = function (data, callback) {
      this.doTask(data, callback, "pause");
   }
   container.unpause = function (data, callback) {
     this.doTask(data, callback, "unpause");
   }
   container.stats = function (data, callback) {
     var self = this;
     var container = (self.docker).getContainer(data);

     return new Promise(function (resolve, reject) {
         resolve(container.stats({"stream": false}));
     }).then(callback);
   }
   container.top = function (data, callback){
     var self = this;
     var container = (self.docker).getContainer(data);
     return new Promise(function (resolve, reject) {
         resolve(container.top ({"ps_args": "aux"}));
     }).then(callback);
   };

   container.logs = function (data, callback){
     var self = this;
     var container = self.docker.getContainer(data);
     return new Promise(function (resolve, reject) {
       //  "follow" : true, , "stderr": true
       container.logs ({ "stdout" : true}).then((data)=>{
         console.log(data);
       });
         resolve(container.logs ({ "stdout" : true}));
     });
   }

   var network = Object.create(test);
   network.getInfo = "getNetwork";
   network.getLists = "listNetworks";

   network.get = function ( data, opts, callback) {
       if(arguments.length === 2) {
         callback = opts;
         opts = null;
       }
       var list = [];

       for(var i in data) {
         var dockerInfo = docker[this.getInfo](data[i].Id);
         if(opts !== null && opts.EndpointConfig){
           opts.EndpointConfig.NetworkID = data[i].Id;
         }
         list.push( new Promise(function (resolve, reject) {
           resolve(dockerInfo[callback](opts) );
         }));
       };
       return list;
     };
   network.list =  function (filters, callback) {
       var self = this;

       return new Promise(function (resolve, reject) {
           resolve((self.docker).listNetworks(filters));
       });
     }
   network.create = function (data, callback) {
     var self = this;
       (self.docker).createNetwork(data).then(self.successCallback.bind(null, callback) , self.failureCallback.bind(null, callback));
   }
   network.remove =  function (data, callback) {
      this.doTask(data, callback, "remove");
   }
   network.connect =  function (data, callback) {
        var self = this;

        var lists = data.lists;
        var container = (data.container);
        var opts = {
                    "Container" : container,
                    "EndpointConfig" : {"NetworkID" : ""}
          };

        var promiseList = self.get( lists, opts, "connect");
         self.dockerPromiseEvent(promiseList, callback);

  }
  network.disconnect =  function (data, callback) {
        var self = this;
        var lists = data.lists;

         var opts = {"Container": data.container };
         var promiseList = self.get( lists, opts, "connect");
        self.dockerPromiseEvent(promiseList, callback);

  };

  var image = Object.create(test);
  image.getInfo = "getImage";
  image.getLists = "listImages";

  image.search =  function (filters, callback) {
        var self = this;
         (self.docker).searchImages(filters).then(self.successCallback.bind(null, callback) , self.failureCallback.bind(null, callback));
  };

  image.remove = function (data, callback) {
       this.doTask(data, callback,  "remove");
  };
  image.create = function (data,  callback) {

    data.forEach( (images) => {
      var self = this;
      console.log(images);
      (self.docker).createImage({ "fromImage" : images.name , "tag" : "latest"},
          callback);
    });

  };
  image.build = function(data, callback) {
      var self = this;
      console.log(data);
      // var tar = require("tar");
      var path = require("path");

      var filePath = data.path + ".tgz";
      var fileName = path.basename(data.path);
      var dirPath = path.dirname(filePath);
      var imageTag = data.imageTag;
      if(imageTag === null || imageTag === "") {
        imageTag = "default"
      }

      console.log(dirPath);

        (self.docker).buildImage( {
              context :  dirPath,
              src : [fileName]
            }, {
                t: imageTag
              }, callback);

  };


    var volume = Object.create(test);
    volume.getInfo = "getVolume";
    volume.getLists = "listVolumes";

    volume.get = function (data, opts, method) {
        if(arguments.length === 2) {
          method = opts;
          opts = null;
        }
        var list = [];

        for(var i in data) {
          var dockerInfo = docker[this.getInfo](data[i].Name);
          list.push( new Promise(function (resolve, reject) {
            resolve(dockerInfo[method](opts) );
          }));
        };
        return list;
      };


    volume.create =  function (data, callback) {
          var self = this;
          (self.docker).createVolume(data).then(self.successCallback.bind(null, callback) , self.failureCallback.bind(null, callback));
    }
    volume.remove = function (data, callback) {
      this.doTask(data, callback, "remove");
    }


    var settings = Object.create(test);

    settings.get = function (data, callback) {
      var lists = [];
      for(var i in data) {
        var opts = {
          host : data[i].ip,
          port : data[i].port
        }
        lists.push(opts);
      }
      return lists;
    }
    settings.ping = function (data, callback) {
      // console.log(data);
      var self = this;
      var lists = self.get(data);

      for (var i in lists) {
        var docker = require("./docker")(lists[i]);
        console.log(docker);
  			docker.ping((err,data)=>{
          console.log(err);
          console.log(data);
          callback(err, data);
        })
      }
    };

    settings.delete = function (data, callback) {
      // console.log(data);
      var self = this;
      // var lists = self.get(data);
      var lists = data;
      for (var i in lists) {
        var dockerDB = require("./mongo.js");

        var db = new dockerDB();
        dockerDB.remove({ _id: lists[i]._id }, function(err, output){
            if(err) {
              console.log(err);
            }

            callback(true);
        });
      }
    };

    var swarm = Object.create(test);
    swarm.getInfo = "getVolume";
    swarm.getLists = "swarmInspect";

    swarm.create = function (data, callback) {
      var self = this;
      self.docker.swarmInit(data).then(self.successCallback.bind(null, callback) , self.failureCallback.bind(null, callback));
    };

    swarm.leave = function (data, callback){
      var self = this;
       self.docker.swarmLeave({force : data}).then(self.successCallback.bind(null, callback) , self.failureCallback.bind(null, callback));
    };
    swarm.getToken = function (data, callback) {
      var self= this;
      return new Promise(function (resolve, reject) {
          resolve(self.docker.swarmInspect());
      });
      // self.docker.swarmInspect().then((data) =>{
      //   //  console.log(data);
      //    resolve(data);
      //  });
    };
    swarm.setRemoteDocker = function (data, callback) {
      this.remoteDocker = require("./docker")(data);
    }
    swarm.join = function (data, callback){
      var self = this;
      var promise = [];
      promise.push(self.getToken());
      Promise.all(promise).then((token)=>{
        // console.log(data);
        // console.log(data.lists.pop());
        var config = data.lists.pop();
        console.log(config);
        var hostconfig = {
          host : config.ip,
          port : config.port
        }
        self.setRemoteDocker(hostconfig);

        var datatoken = token.pop(); /// token array로 와서 pop함
        var opts = {
          "AdvertiseAddr": config.ip,
          "ListenAddr": "0.0.0.0:2377",
          "RemoteAddrs": ["192.168.0.108"],
          "JoinToken": "",
        }
        console.log(datatoken);
        console.log(data.type);
        if(data.type === "worker"){
          opts.JoinToken = (datatoken.JoinTokens.Worker);
        }else if(data.type === "manager"){
          opts.JoinToken = (datatoken.JoinTokens.Manager);
        }
        self.remoteDocker.swarmJoin(opts).then( (err, data)=>{
          console.log(err);
          console.log(data);
        });

// {
// "ListenAddr": "0.0.0.0:2377",
// "AdvertiseAddr": "192.168.1.1:2377",
// "RemoteAddrs": [
// "node1:2377"
// ],
// "JoinToken": "SWMTKN-1-3pu6hszjas19xyp7ghgosyx9k8atbfcr8p2is99znpy26u2lkl-7p73s1dx5in4tatdymyhg9hu2"
// }

      });
    };


   var lists = {
     "container" : container,
     "network" : network,
     "image" : image,
     "volume" : volume,
     "settings" : settings,
     "swarm" : swarm
   }

module.exports = lists;
