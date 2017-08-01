
// var p = {
//   "volume": {
//     "get" : function (data, opts ,callback) {
//      if(arguments.length == 2) {
//        callback = opts;
//        opts = null;
//      }
//        var list = [];
//        console.log(data);
//        for(var i in data) {
//            var volume = docker.getVolume(data[i].Name);
//            console.log(data);
//            list.push( new Promise(function (resolve, reject) {
//                  resolve(volume[callback](opts) );
//            }));
//          };
//          return list;
//        },
//     "create" : function (data, callback) {
//       docker.createVolume(data).then(successCallback.bind(null, callback) , failureCallback.bind(null, callback));
//
//        },
//     "remove" : function (data, callback) {
//       var promiseList = p.volume.get(data, "remove");
//       dockerPromiseEvent(promiseList, callback);
//      //  docker.searchImages(filters).then(successCallback.bind(null, callback) , failureCallback.bind(null, callback));
//     }
//   },
//



  var p = function( docker){
    this.docker = docker;
    this.getInfo = null;
  };

  p.prototype.get = function (data, opts, callback) {
      if(arguments.length === 2) {
        callback = opts;
        opts = null;
      }
      var list = [];
      console.log(data);
      for(var i in data) {
        var dockerInfo = docker[this.getInfo](data[i].Id);
        console.log(callback);
        list.push( new Promise(function (resolve, reject) {
          resolve(dockerInfo[callback](opts) );
        }));
      };
      return list;
    };

  p.prototype.successCallback = function (callback, data){
      console.log("successed");
      console.log(data);
      var result = {
        "state" : true,
        "msg" : data
      };
      callback(result);
    }
  p.prototype.failureCallback = function (callback, data){
      console.log("failed");
      console.log(data);
      var error = {
          "state" : false ,
          "statusCode" : data.statusCode,
          "msg" : data.json.message
        }
      callback(error);
    }

  p.prototype.dockerPromiseEvent = function(promiselist, callback) {
      Promise.all(promiselist).then(this.successCallback.bind(null, callback) , this.failureCallback.bind(null, callback));
  }

  p.prototype.doTask = function(data, callback, opts,task){
    var self = this ;
    if(arguments.length === 3){
      task = opts;
      opts = null;
      var promiseList = self.get(data, task);
    }else {
      var promiseList = self.get(data, opts, task);
    }
    self.dockerPromiseEvent(promiseList, callback);
  };

  var docker = require("./docker")();

  var test = new p(docker);

   var container = Object.create(test);

   container.getInfo = "getContainer";
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
     var container = self.docker.getContainer(data);

     return new Promise(function (resolve, reject) {
         resolve(container.stats({"stream": false}));
     });
   }
   container.top = function (data, callback){
     var self = this;
     var container = self.docker.getContainer(data);
     return new Promise(function (resolve, reject) {
         resolve(container.top ({"ps_args": "aux"}));
     });
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
   network.get = function ( data, opts, callback) {
       if(arguments.length === 2) {
         callback = opts;
         opts = null;
       }
       var list = [];
       for(var i in data) {
         var dockerInfo = docker[this.getInfo](data[i].Id);
         if(opts.EndpointConfig){
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
       (self.docker).listNetworks(filters).then(successCallback.bind(null, callback) , failureCallback.bind(null, callback));
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
      (self.docker).createImage({ "fromImage" : images.name , "tag" : "latest"},
          callback);
    });

  };
  image.build = function(data, callback) {
      var self = this;
      console.log(data);
      var tar = require("tar");
      var path = require("path");
      // var tarfile =  data.name + ".tgz";
      // console.log(tarfile);
      var filePath = data.path + ".tgz";
      var fileName = path.basename(data.path);
      var dirPath = path.dirname(filePath);
      console.log(fileName);
      // tar.c(
      //   {
      //     gzip: true,
      //     file: filePath
      //   },
      //   [ data.path]
      // ).then( () => {console.log("do");});

      // console.log(data.path);
      // console.log(data.name);
      // Dockerfile
      console.log(dirPath);
      (self.docker).buildImage( {
        context :  dirPath,
        src : [fileName]
      }, {
          t: 'renewal'
        }, function(err, stream) {
          if(err) return console.error(err);
              console.log(stream);
              stream.pipe(process.stdout, {end: true});

              stream.on('end', function() {
                console.log("end");
                // done();
              });
        });
  };


    var volume = Object.create(test);
    volume.getInfo = "getVolume";

    volume.create =  function (data, callback) {
          var self = this;
          (self.docker).createVolume(data).then(self.successCallback.bind(null, callback) , self.failureCallback.bind(null, callback));
    }
    volume.remove = function (data, callback) {
      this.doTask(data,callback, "remove");
    }


   var lists = {
     "container" : container,
     "network" : network,
     "image" : image,
     "volume" : volume
   }

module.exports = lists;
