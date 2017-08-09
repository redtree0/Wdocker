

  var p = function( docker){
    this.docker = docker;
    this.getInfo = null;
    this.getLists = null;
    this.remoteDocker = null;
    this.attr = null;
  };


  p.prototype.successCallback = function (callback, data){
      // console.log("successed");
      // console.log(data);
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
      var self = this;
      var hasOpts = true;
      if(arguments.length === 2) {
        method = opts;
        opts = null;
        var hasOpts = false;
      }
      var list = [];
      var args = null;

      for(var i in data) {

        var dockerInfo = self.docker[self.getInfo](data[i][(self.attr)]);

        if(hasOpts){
          list.push( new Promise(function (resolve, reject) {
            resolve(dockerInfo[method](opts) );
          }));
        }else {
          list.push( new Promise(function (resolve, reject) {
            resolve(dockerInfo[method]() );
          }));
        }
      };
      return list;
    };

  p.prototype.dockerPromiseEvent = function(promiselist, callback) {
      Promise.all(promiselist).then(this.successCallback.bind(null, callback) , this.failureCallback.bind(null, callback));
  }

  p.prototype.doTask = function(data, callback, opts, task){
    var self = this ;
    console.log("doTask");
    console.log(self.getInfo);
    if(arguments.length === 3){
      task = opts;
      opts = null;
      console.log(task);
      console.log(opts);
      var promiseList = self.get(data, task);
    }else {
      var promiseList = self.get(data, opts, task);
    }
    self.dockerPromiseEvent(promiseList, callback);
  };

  p.prototype.getAllLists = function (opts, callback){
    var self = this;
    var dockerInfo = self.docker[self.getLists](opts);
    console.log("getlists");
    console.log(this.getLists);
    return new Promise(function(resolve, reject){
      resolve(dockerInfo);
    }).then(callback);

  };

  p.prototype.setRemoteDocker = function (data, callback) {
    this.remoteDocker = require("./docker")(data);
    // return this.remoteDocker;
  }

  p.prototype.setDocker = function (data, callback) {
    // this.docker = require("./docker")(data);
    return require("./docker")(data);
  }

  p.prototype.getDocker = function (data, callback) {
    // this.docker = require("./docker")(data);
    return this.docker;
  }

  var docker = require("./docker")();

  var test = new p(docker);

   var container = Object.create(test);

   container.getInfo = "getContainer";
   container.getLists = "listContainers";
   container.attr = "Id";

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
   network.attr = "Id"

   network.get = function ( data, opts, callback) {
       if(arguments.length === 2) {
         callback = opts;
         opts = null;
       }
       var list = [];
       var self = this;

       for(var i in data) {

         var dockerInfo = docker[self.getInfo](data[i][self.attr]);
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
  image.attr = "Id";

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
      console.log(imageTag);
        (self.docker).buildImage( {
              context :  dirPath,
              src : [fileName]
            }, {
                "t" : imageTag.toString()
              }, callback);

  };


    var volume = Object.create(test);
    volume.getInfo = "getVolume";
    volume.getLists = "listVolumes";
    volume.attr = "Name";


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
        var dbLists = require("./mongo.js");

        dbLists.docker.remove({ _id: lists[i]._id }, function(err, output){
            if(err) {
              console.log(err);
            }

            callback(true);
        });
      }
    };

    settings.connectDocker = function (data, callback) {
        var self = this;
        return self.setRemoteDocker(data);
    };

    var swarm = Object.create(test);
    // swarm.getInfo = "getVolume";
    swarm.getLists = "swarmInspect";

    swarm.create = function (data, callback) {
      var self = this;
      return self.docker.swarmInit(data);
      // self.docker.swarmInit(data).then(self.successCallback.bind(null, callback) , self.failureCallback.bind(null, callback));
    };

    swarm.leave = function (data, callback){
      var self = this;
      console.log("swarm leave");
       self.docker.swarmLeave({force : data}).then(self.successCallback.bind(null, callback) , self.failureCallback.bind(null, callback));
    };

    swarm.getToken = function (data, callback) {
      var self= this;
      // return self.docker.swarmInspect();
      return new Promise(function (resolve, reject) {
          resolve(self.docker.swarmInspect());
      });
    };


    swarm.join = function (data, callback){
      var self = this;
        // console.log(data);
        // console.log(data.lists.pop());
        var hostconfig = {
          host : data.host,
          port : data.port
        }
        var state = null;
        if(data.type === "worker"){
          state = true;
        }else if(data.type === "manager"){
          state = false;
        }
        self.setRemoteDocker(hostconfig);
        var mongo = require("./mongoController");

        mongo.system.show((result)=>{
            var opts = {
              "AdvertiseAddr": hostconfig.host,
              "ListenAddr": "0.0.0.0:"+result[0].swarmPort,
              "RemoteAddrs": [result[0].swarmIP + ":" + result[0].swarmPort],
              "JoinToken": ""
            }
            if(state){
              opts.JoinToken = (result[0].token.worker);
            }else {
              opts.JoinToken = (result[0].token.manager);
            }
            console.log(opts);
            console.log(self.remoteDocker);
            self.remoteDocker.swarmJoin(opts).then( (err, data)=>{
              console.log("swarm Join");
              console.log(err);
              console.log(data);
            });
        });

    };

   swarm.throwNode = function (data, callback){
        var self = this;
        var hostconfig = {
         host : data.host,
         port : data.port
        }
          console.log(hostconfig);
          self.setRemoteDocker(hostconfig);
          console.log({force : data.type});
           self.remoteDocker.swarmLeave({force : data.type}).then( (err, data)=>{
            console.log(err);
            console.log(data);
          });
    };

    var node = Object.create(test);
    node.getInfo = "getNode";
    node.getLists = "listNodes";
    node.attr = "ID"

    node.start = function (data, callback){
      var self = this;

      var host = data[0].Status.Addr;
      var role = data[0].Spec.Role;

       var mongo = require("./mongoController");

       mongo.docker.find({ip : host}, (result)=>{
         var hostconfig = {
           "host" : result.ip,
           "port" : result.port
         };
         self.setRemoteDocker(hostconfig);
         console.log(self.remoteDocker);
          self.remoteDocker.swarmLeave({"force" : true}).then( ()=>{

            mongo.system.show((result)=>{
              console.log("result");
              console.log(result);

              var opts = {
                "AdvertiseAddr": hostconfig.host,
                "ListenAddr": "0.0.0.0:"+ result[0].swarmPort,
                "RemoteAddrs": [result[0].swarmIP + ":" + result[0].swarmPort],
                "JoinToken": ""
              }
              if(role === "worker"){
                opts.JoinToken = (result[0].token.worker);
              }else {
                opts.JoinToken = (result[0].token.manager);
              }
              //      console.log(opts);
              //      console.log(self.remoteDocker);
              self.remoteDocker.swarmJoin(opts).then( (err, data)=>{
                console.log("swarm Join");
                console.log(err);
                console.log(data);
              });
            });


          });

       });


    };

    node.remove = function (data, callback){
      this.doTask(data, callback, {force: true},"remove");
    };

    node.update = function (data, callback){
      console.log(data);
      console.log(data.lists);
      var self = this;
      callback;
      var tmp = data.lists;
      for(var i in tmp){
        var opts = {
          "id" : tmp[i].ID,
          "version" : tmp[i].Version.Index,
          "Role" : "worker",
          "Availability" : data.Availability
        };
        var node = (self.docker).getNode(tmp[i].ID);
        node.update(opts).catch((err)=>{
           console.log(err);
         }).then(callback);
      }
    }

    var service = Object.create(test);
    service.getInfo = "getService";
    service.getLists = "listServices";
    service.attr = "ID";

    service.create = function(data, callback){
      var self = this;
      (self.docker).createService(data).then(self.successCallback.bind(null, callback) , self.failureCallback.bind(null, callback));
    };

    service.remove = function(data, callback){
        this.doTask(data, callback, "remove");
    };

    service.inspect = function(data, callback){
        this.doTask(data, callback, "inspect");
    };





   var lists = {
     "container" : container,
     "network" : network,
     "image" : image,
     "volume" : volume,
     "settings" : settings,
     "swarm" : swarm,
     "node" : node,
     "service" : service
   }

module.exports = lists;
