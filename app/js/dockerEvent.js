
  var mongo = require("./mongoController.js");
  var path = require("path");
  var Docker = require("./docker");
  var dbLists = require("./mongo.js");
  var os = require("os");


  function getServerIp() {
      var ifaces = os.networkInterfaces();
      var result = '';
      for (var dev in ifaces) {
          var alias = 0;
          if(dev === "eth0"){
            ifaces[dev].forEach(function(details) {
              if (details.family == 'IPv4' && details.internal === false) {
                result = details.address;
                ++alias;
              }
            });
          }
      }

      return result;
  }



  var Common = function( docker){
    this.docker = docker; /// docker modem 겍체 설정
    this.getInfo = null; /// docker get method 설정
    this.getLists = null; /// docker getlists method 설정
    this.attr = null; /// docker key attr 설정
    this.remoteDocker = null; /// 원격 docker 설정
  };

  (function(){ //// this =  p.prototype
    var self = this;

    /** @method  - successCallback
    *  @description promise 성공 시 callback
    *  @param {Function} callback - 콜백 함수
    *  @param {Object} data - promise 데이터
    *  @return {Function} callback - 콜백 함수
    */
    self.successCallback = function (callback, data){
      console.log("success");
      // console.log(arguments);
      // console.log(data);
      var result = {
        "state" : true,
        "statusCode" : 200,
        "msg" : data
      };
      return callback(result);
    };

    /** @method  - failureCallback
    *  @description promise 실패 시 callback
    *  @param {Function} callback - 콜백 함수
    *  @param {Object} data - promise 데이터
    *  @return {Function} callback - 콜백 함수
    */
    self.failureCallback = function (callback, err){
      console.log("failed");
      console.log(err);
      var result = {
        "state" : false ,
        "statusCode" : err.statusCode,
        "msg" : err.json.message,
        "error" : err.reason
      }
      return callback(result);
    };

    /** @method  - get
    *  @description 실행할 Promise를 GET함
    *  @param {Object} data - promise 데이터
    *  @param {Object} opts - docker 실행 시 필요한 옵션
    *  @param {String} method - docker에서 실행할 메소드
    *  @return {Array} lists - Promise Array
    */
    self.get = function (data, opts, method) {
      var self = this;
      var hasOpts = true;
      var hasGetInfo = false;
      if(self.hasOwnProperty("getInfo")){
        hasGetInfo = true;
      }
      if(arguments.length === 2) {
        method = opts;
        opts = null;
        hasOpts = false;
      }
      var list = [];
      var dockerInfo = null;
      // console.log(data);
      for(var i in data) {
        if(hasGetInfo){  /// getInfo 있는지 여부
          // console.log(data[i]);
          dockerInfo = self.docker[self.getInfo](data[i][(self.attr)]);
        }else {
          return ;
        }
        if(hasOpts){ /// opts 있는지 여부
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

    /** @method  - dockerPromiseEvent
    *  @description Promise 실행한다. 이때 전부 성공 시  Event는 successCallback, 하나 이상의 실패가 발생 시 failureCallback
    *  @param {Object} promiselist - 실행할 promise 목록
    *  @param {Function} callback - client로 보낼 콜백함수
    *  @return {Object} Promise
    */
    self.dockerPromiseEvent = function(promiselist, callback) {
        var self = this;
        // return Promise.all(promiselist).then(self.successCallback.bind(null, callback) , self.failureCallback.bind(null, callback));
        return Promise.all(promiselist).then(self.successCallback.bind(self, callback) , self.failureCallback.bind(self, callback));
    }


    /** @method  - doTask
    *  @description parameter에 따라 get 과 dockerPromiseEvent를 호출한다.
    *  @param {Object} data - 실행할 promise 목록
    *  @param {Function} callback - client로 보낼 콜백함수
    *  @param {Object} opts - docker 실행 시 필요한 옵션
    *  @param {String} method - 실행할 메소드
    *  @return {Function} callback - client로 보낼 콜백함수
    */
    self.doTask = function(data, callback, opts, method){
      var self = this ;

      var promiseList = null;
      if(arguments.length === 3){
        method = opts;
        opts = null;
        promiseList = self.get(data, method);
      }else {
        promiseList = self.get(data, opts, method);
      }
      return self.dockerPromiseEvent(promiseList, callback);
    };

    /** @method  - getAllLists
    *  @description self.getLists 와 opts에 따라 promise 생성 후 리턴
    *  @param {Object} opts - docker 실행 시 필요한 옵션
    *  @param {Function} callback - client로 보낼 콜백함수
    *  @return {Function} callback - res로 보낼 콜백함수
    */
    self.getAllLists = function (opts, successCallback, failCallback, remoteDocker){
      var self = this;
      var docker = null;
      if(remoteDocker !== null && remoteDocker !== undefined){
        docker = remoteDocker;
      }else {
        docker = self.docker;
      }
      // console.log(docker);
      if(self.getLists !== null){
        var dockerInfo = docker[self.getLists](opts);
        return new Promise(function(resolve, reject){
          resolve(dockerInfo);
        }).then(successCallback, failCallback);
      }else {
        return;
      }


    };

    /** @method  - setRemoteDocker
    *  @description 다른 호스트의 도커에 접속하기 위한 값 설정, p 객체에 remotedocker SET
    *  @param {Object} config - 원격 docker 접속 시 필요한 옵션
    */
    self.setRemoteDocker = function (config) {
      var self = this;
      self.remoteDocker = new Docker(config);
    }

    /** @method  - setRemoteDocker
    *  @description 다른 호스트의 도커에 접속하기 위한 값 설정, p 객체에 remotedocker SET
    *  @param {Object} config - 원격 docker 접속 시 필요한 옵션
    */
    var serverIp = getServerIp();
    self.setNewRemoteDocker = function (host) {
              var self = this;
              var docker = null;
              function dockerHeathCheck(docker, type){
                  // type  remote or local
                  self.ping(docker, (err, data)=>{
                      if(err === null){
                        self[type] = docker;
                        console.log(docker);
                      }else {
                        self.remoteDocker = null;
                      }
                  });
              }

              if(host !== serverIp  && host !== "default") {

                  mongo.docker.find({"ip" : host}, (result)=>{
                    // console.log(result);
                    if(result === null){
                      return callback(false);
                    }
                    var opts = {
                      "host" : result.ip,
                      "port" : result.port
                    }

                    docker = new Docker(opts);
                    // console.log(docker);
                    return dockerHeathCheck(docker, "remoteDocker");
                    // return callback(docker);
                  });
              }else if(host === getServerIp() || host === null ) {

                docker = new Docker();
                return dockerHeathCheck(docker, "docker");

              }
    }



          /** @method  - ping
          *  @description docker host ping test
          *  @param {Object} data - 설정 데이터
          *  @param {Function} callback - 클라이언트로 보낼 callback
          */
          self.ping = function (docker, callback) {
                return docker.ping(callback);
          };


    /** @method  - getDocker
    *  @description docker modem 객체 GET
    *  @return {Object} docker modem 객체
    */
    self.getDocker = function () {
      var self = this;
      return self.docker;
    }

    /** @method  - getTastDocker
    *  @description docker modem 객체 GET
    *  @return {Object} docker modem 객체
    */
    self.getTaskDocker = function(host, callback){

        var self = this;
        var docker = null;
        if(host !== getServerIp()  && host !== "default") {

            mongo.docker.find({"ip" : host}, (result)=>{
              // console.log(result);
              if(result === null){
                docker = new Docker();
                return   callback(docker);
              }
              var opts = {
                "host" : result.ip,
                "port" : result.port
              }

              docker = new Docker(opts);
              // console.log(docker);
              return self.ping(docker, (err, data)=>{
                  if(err === null){
                    callback(docker);
                  }
              });
              // return callback(docker);
            });
        }else if(host === getServerIp() || host === null ) {

          docker = new Docker();
          return   callback(docker);
          // return self.ping(docker, (err, data)=>{
          //     if(err === null){
          //       callback(docker);
          //     }
          // });
        }
    }

  }).call(Common.prototype);

  var docker = new Docker();

  var common = new Common(docker);

   var Container = Object.create(common);

   (function(){
     var self = this;
     self.getInfo = "getContainer";
     self.getLists = "listContainers";
     self.attr = "Id";

     /** @method  - create
     *  @description docker container 생성
     *  @param {Object} data - 설정 데이터
     *  @param {Function} callback - 클라이언트로 보낼 callback
     *  @return {Object} docker.createContainer
     */
     self.create = function (data, callback) {
      //  console.log(data);
       return (self.docker).createContainer(data).then(self.successCallback.bind(self, callback) , self.failureCallback.bind(self, callback));
     }

     /** @method  - start
     *  @description docker container 시작
     *  @param {Object} data - 설정 데이터
     *  @param {Function} callback - 클라이언트로 보낼 callback
     *  @return {Function} doTask
     */
     self.start  = function (data, callback) {
       return self.doTask(data, callback, "start");
     }

     /** @method  - stop
     *  @description docker container 멈춤
     *  @param {Object} data - 설정 데이터
     *  @param {Function} callback - 클라이언트로 보낼 callback
     *  @return {Function} doTask
     */
     self.stop =  function (data, callback) {
       return self.doTask(data, callback, "stop");
     }

     /** @method  - remove
     *  @description docker container 삭제
     *  @param {Object} data - 설정 데이터
     *  @param {Function} callback - 클라이언트로 보낼 callback
     *  @return {Function} doTask
     */
     self.remove = function (data, callback) {
       return self.doTask(data, callback, "remove");
     }

     /** @method  - kill
     *  @description docker container kill
     *  @param {Object} data - 설정 데이터
     *  @param {Function} callback - 클라이언트로 보낼 callback
     *  @return {Function} doTask
     */
     self.kill = function (data, callback) {
       return self.doTask(data, callback, "kill");
     }

     /** @method  - getArchive
     *  @description docker container getArchive
     *  @param {Object} data - 설정 데이터
     *  @param {Function} callback - 클라이언트로 보낼 callback
     *  @return {Function} doTask
     */
     self.getArchive = function (data, callback) {
       return self.doTask(data, callback, "getArchive");
     }

     /** @method  - pause
     *  @description docker container 정지
     *  @param {Object} data - 설정 데이터
     *  @param {Function} callback - 클라이언트로 보낼 callback
     *  @return {Function} doTask
     */
     self.pause = function (data, callback) {
       return self.doTask(data, callback, "pause");
     }

     /** @method  - unpause
     *  @description docker container 정지 해제
     *  @param {Object} data - 설정 데이터
     *  @param {Function} callback - 클라이언트로 보낼 callback
     *  @return {Function} doTask
     */
     self.unpause = function (data, callback) {
       return self.doTask(data, callback, "unpause");
     }

    //  /** @method  - stats
    //  *  @description docker container stats GET
    //  *  @param {Object} data - 설정 데이터
    //  *  @param {Function} callback - 클라이언트로 보낼 callback
    //  *  @return {object} Promise
    //  */
    //  self.stats = function (data, callback) {
    //    var container = (self.docker).getContainer(data);
     //
    //    return new Promise(function (resolve, reject) {
    //      resolve(container.stats({"stream": false}));
    //    }).then(callback);
    //  }
     //
    //  /** @method  - top
    //  *  @description docker container top GET
    //  *  @param {Object} data - 설정 데이터
    //  *  @param {Function} callback - 클라이언트로 보낼 callback
    //  *  @return {object} Promise
    //  */
    //  self.top = function (data, callback){
    //    var container = (self.docker).getContainer(data);
    //    return new Promise(function (resolve, reject) {
    //      resolve(container.top ({"ps_args": "aux"}));
    //    }).then(callback);
    //  };
     //
    //  /** @method  - logs
    //  *  @description docker container logs GET
    //  *  @param {Object} data - 설정 데이터
    //  *  @param {Function} callback - 클라이언트로 보낼 callback
    //  *  @return {object} Promise
    //  */
    //  self.logs = function (data, callback){
    //    var container = self.docker.getContainer(data);
    //    return new Promise(function (resolve, reject) {
    //      //  "follow" : true, , "stderr": true
    //      container.logs ({ "stdout" : true}).then((data)=>{
    //        console.log(data);
    //      });
    //      resolve(container.logs ({ "stdout" : true}));
    //    });
    //  }
     self.attach = function(data, stdin, stdout, stderr){
       var docker = self.docker;
       var container = docker.getContainer(data);
      //  return stdin((data, fn)=>{
      //    fn(true);
      //   //  callback(true);
      //   var cmd = data.split(" ");
      //   // cmd.unshift("-c");
      //   // cmd.unshift("bash");
      //   console.log(cmd);
      //    var options = {
      //      Cmd: cmd,
      //      AttachStdin: true,
      //      AttachStdout: true,
      //      AttachStderr: true,
      //      DetachKeys: "ctrl-c",
      //      Tty : true
      //    };
       //
      //    container.exec(options, function(err, exec) {
      //     //  console.log(exec);
      //      if (err) return;
      //     // console.log(exec);
      //      exec.start({hijack: true, stdin: true, Tty : true, Detach : false},function(err, stream) {
      //             //  console.log(err);
      //             if(data === "exit"){
      //               // console.log(data);
      //               // stream.end();
      //               container.stop();
      //             }
       //
      //             stream.setEncoding('utf8');
      //              stderr(stream);
      //              stdout(stream);
      //              // stdin(stream);
      //              docker.modem.demuxStream(stream, process.stdout, process.stderr);
      //      });
       //
      //    });
      var options = {
           Cmd: ["/bin/bash"],
           AttachStdin: true,
           AttachStdout: true,
           AttachStderr: true,
           DetachKeys: "ctrl-c",
           Tty : true
         };
      container.exec(options, function(err, exec) {
         exec.start({hijack: true, stdin: true, Tty : true, Detach : false},function(err, stream) {
           //// exex stream attach에 넣기
            container.attach({hijack: true, stream: true, stdin: true, stdout: true, stderr: true}, function (err, Stream) {

              stderr(stream);
              stdin(stream, container);
              stdout(stream);
            });
          });
      });
      //  });
     };
   }).call(Container);

   var Network = Object.create(common);

   (function(){
     var self = this;
     self.getInfo = "getNetwork";
     self.getLists = "listNetworks";
     self.attr = "Id"

     /** @method  - logs
     *  @description p.get overwrite EndpointConfig.NetworkID 추가 설정을 위함
     *  @param {Object} data - promise 데이터
     *  @param {Object} opts - docker 실행 시 필요한 옵션
     *  @param {String} callback - docker 메소드
     *  @return {Array} lists - Promise Array
     */
     self.get = function ( data, opts, method) {
       if(arguments.length === 2) {
         method = opts;
         opts = null;
       }
       var list = [];
       var self = this;

       for(var i in data) {

         var dockerInfo = self.docker[self.getInfo](data[i][self.attr]);
         if(opts !== null && opts.EndpointConfig){
           opts.EndpointConfig.NetworkID = data[i].Id;
         }
         list.push( new Promise(function (resolve, reject) {
           resolve(dockerInfo[method](opts) );
         }));
       };
       return list;
     };


     /** @method  - create
     *  @description network 생성
     *  @param {Object} data - 설정 데이터
     *  @param {Function} callback - 클라이언트로 보낼 callback
     *  @return {object} Promise
     */
     self.create = function (data, callback) {
       return (self.docker).createNetwork(data).then(self.successCallback.bind(self, callback) , self.failureCallback.bind(self, callback));
     }

     /** @method  - remove
     *  @description network 제거
     *  @param {Object} data - 설정 데이터
     *  @param {Function} callback - 클라이언트로 보낼 callback
     *  @return {object} Promise
     */
     self.remove =  function (data, callback) {
       self.doTask(data, callback, "remove");
     }


     /** @method  - connect
     *  @description network에 container 연결
     *  @param {Object} data - 설정 데이터
     *  @param {Function} callback - 클라이언트로 보낼 callback
     *  @return {object} Promise
     */
     self.connect =  function (data, callback) {
      //  console.log(data);
       var lists = data.checkedRowLists;
       var container = (data.opts.container);
       var opts = {
         "Container" : container,
         "EndpointConfig" : {"NetworkID" : ""}
       };

      //  console.log(opts);
       var promiseList = self.get( lists, opts, "connect");
       return self.dockerPromiseEvent(promiseList, callback);

     }

     /** @method  - disconnect
     *  @description network에 container 연결 해제
     *  @param {Object} data - 설정 데이터
     *  @param {Function} callback - 클라이언트로 보낼 callback
     *  @return {object} Promise
     */
     self.disconnect =  function (data, callback) {

       var lists = data.checkedRowLists;
       var opts = data.opts;
      //  console.log(lists);
      //  console.log(opts);
       var promiseList = self.get( lists, opts, "disconnect");
       return  self.dockerPromiseEvent(promiseList, callback);

     };

   }).call(Network);


  var Image = Object.create(common);

  (function(){
    var self = this;
    self.getInfo = "getImage";
    self.getLists = "listImages";
    self.attr = "Id";


    function dockerStream(callback, err, stream){
          if (err) return callback(err);
          var docker = self.docker;
         //  console.log(server);
        //  console.log("stream");
          docker.modem.followProgress(stream, onFinished, onProgress);

           function onFinished(err, output) {

                var finished  = null;
                if(err){
                  finished = {"stream" : "Error: > "+ err};
                }else {
                  finished = true;
                }
                  callback(finished);

           }
           function onProgress(event) {
            //  console.log(event);
              callback(event);
           }
    }

    /** @method  - search
    *  @description hub.docker.com에 있는 이미지 검색
    *  @param {Object} filters - 검색할 데이터
    *  @param {Function} callback - 클라이언트로 보낼 callback
    *  @return {object} Promise
    */
    self.search =  function (filters, callback) {
      return (self.docker).searchImages(filters).then(self.successCallback.bind(self, callback) , self.failureCallback.bind(self, callback));
    };

    /** @method  - remove
    *  @description 이미지 제거
    *  @param {Object} data - 설정 데이터
    *  @param {Function} callback - 클라이언트로 보낼 callback
    *  @return {Function} doTask
    */
    self.remove = function (data, callback) {
      // return self.doTask(data, callback,  "remove");
      console.log(data);
      return self.docker.getImage(data).remove().then(self.successCallback.bind(self, callback) , self.failureCallback.bind(self, callback));
    };

    /** @method  - tag
    *  @description 이미지 태그
    *  @param {Object} data - 설정 데이터
    *  @param {Function} callback - 클라이언트로 보낼 callback
    *  @return {Function} doTask
    */
    self.tag = function (data, callback) {

      var image = self.docker.getImage(data.orgImage);
      // data.name +":" + data.tag
      var opts = {
        repo : data.repo,
        tag : data.tag
      };

      return image.tag(opts).then(self.successCallback.bind(self, callback) , self.failureCallback.bind(self, callback));

      // return self.doTask(data, callback,  "remove");
    };



    /** @method  - push
    *  @description docker 레퍼지토리에 이미지 올림
    *  @param {Object} data - 설정 데이터
    *  @param {Function} callback - 클라이언트로 보낼 callback
    *  @return {Function} doTask
    */
      self.push = function (data, onProgress, callback) {

          if(data){
            var image = self.docker.getImage(data.name +":" + data.tag);

              image.push(data, dockerStream.bind(self, onProgress), data.auth);
          }
          callback(true);
      };

      /** @method  - create
      *  @description 이미지 다운로드
      *  @param {Object} data - 설정 데이터
      *  @param {Function} callback - 클라이언트로 보낼 callback
      */
      self.create = function (data,  onProgress, callback) {
          data.forEach( (images) => {
            (self.docker).createImage({ "fromImage" : images.name , "tag" : "latest"},
                      dockerStream.bind(null, onProgress)
                );
          });
          callback("작업완료");

      };

      /** @method  - build
      *  @description 이미지 빌드
      *  @param {Object} data - 설정 데이터
      *  @param {Function} callback - 클라이언트로 보낼 callback
      *  @return {Function} doTask
      */
      var fs = require('fs');
      self.build = function(data,  onProgress) {
          var docker = self.docker;

            var filePath = data.path ;
            var fileName = path.basename(filePath);
            var dirPath = path.dirname(filePath);
            var imageTag = data.imageTag;
            if(imageTag === null || imageTag === "") {
              imageTag = "default"
            }
            // console.log(docker);
            fs.readdir(dirPath, function(err, list) {

                var search = null;
                for(var i in list){
                  search = path.join(dirPath, list[i])
                  try{
                    if(fs.lstatSync(search).isDirectory()){
                      list.splice(i, 1)
                    }
                  }catch(e){
                    console.log(e);
                  }
                }

                docker.buildImage( {
                  context :  dirPath,
                  src : list
                }, {
                  "dockerfile" : fileName,
                  "t" : imageTag.toString()

                }, dockerStream.bind(this, onProgress));
            });

      };

  }).call(Image);


    var Volume = Object.create(common);
    (function(){ /// this =  volume
      var self = this;
      self.getInfo = "getVolume";
      self.getLists = "listVolumes";
      self.attr = "Name";

      /** @method  - create
      *  @description volume create
      *  @param {Object} data - 설정 데이터
      *  @param {Function} callback - 클라이언트로 보낼 callback
      *  @return {Object} Promise
      */
      self.create =  function (data, callback) {
        return (self.docker).createVolume(data).then(self.successCallback.bind(self, callback) , self.failureCallback.bind(self, callback));
      }

      /** @method  - remove
      *  @description volume remove
      *  @param {Object} data - 설정 데이터
      *  @param {Function} callback - 클라이언트로 보낼 callback
      *  @return {Object} Promise
      */
      self.remove = function (data, callback) {
        return self.doTask(data, callback, "remove");
      }
    }).call(Volume);


    var Settings = Object.create(common);

    (function(){
      var self = this;

      /** @method  - ping
      *  @description docker host ping test
      *  @param {Object} data - 설정 데이터
      *  @param {Function} callback - 클라이언트로 보낼 callback
      */
      self.ping = function (data, callback) {
        // console.log(data);
        var local = getServerIp();
        var docker = null;
        if(data.hasOwnProperty("host") && data.hasOwnProperty("port")){
          if(local === data.host){
            docker = new Docker();
          }else {
            docker = new Docker(data);
          }

          docker.ping((err,data)=>{

              if(err !== null){
                  callback({err : err, data: data, statusCode : 500});
              }else {
                  callback({err : err, data: data});
              }

          });
        }else {
          callback({data : "IP or Port is null"});
        }

      };

      /** @method  - delete
      *  @description docker host 정보 삭제
      *  @param {Object} data - 설정 데이터
      *  @param {Function} callback - 클라이언트로 보낼 callback
      */
      self.delete = function (data, callback) {


        dbLists.docker.remove(data, function(err, output){
          if(err) {
            callback(err);
          }
          callback({statusCode : 200});
        });
      };

      self.authCheck = function(data, callback){
          data.serveraddress = "https://index.docker.io/v1/"
          self.docker.checkAuth(data).then(self.successCallback.bind(self, callback) , self.failureCallback.bind(self, callback));

      }


    }).call(Settings);



    var Swarm = Object.create(common);

    function getSwarmDocker(self, host, hostconfig){
        var docker = null;
        if(host === null){
          console.log("host is null");
          return ;
        }
        if(host === getServerIp()){
          docker = self.docker;
        }else{
          self.setRemoteDocker(hostconfig);
          docker = self.remoteDocker;
        }
        return docker;
    }

    (function(){
      var self = this;
      self.getLists = "swarmInspect";
      self.getAllLists = function(data, callback){
        var self = this;

        if(self.getLists !== null){
          var dockerInfo = self.docker[self.getLists]();
        }
        mongo.docker.show( (result)=>{

            for(var i in result){
                  // console.log(result[i]);
                  var hostconfig = {
                    host : result[i].ip,
                    port : result[i].port
                  }
                  var docker = getSwarmDocker(self, hostconfig.host, hostconfig);
                  var dockerInfo = self.docker[self.getLists]();
                  dockerInfo.then((data)=>{
                    callback(data);

                  }).catch((err)=>{
                    // console.log(err);
                  });

            }
        });

      };



      /** @method  - update
      *  @description swarm join
      *  @param {Object} data - 설정 데이터
      *  @param {Function} callback - 클라이언트로 보낼 callback
      */
      self.update = function (data, callback) {
        // return;

        function setSwarm(node, token){
          var hostconfig = {};
          hostconfig.host = node.ip;
          if(node.hasOwnProperty("port")){
              hostconfig.port = node.port;
          }

          swarmJoin.AdvertiseAddr = node.ip;
          swarmJoin.JoinToken = token;
          var docker = getSwarmDocker(self, hostconfig.host, hostconfig);
          console.log(docker);
          docker.swarmJoin(swarmJoin).then(self.successCallback.bind(self, callback) , self.failureCallback.bind(self, callback));
          ;
        }

        var managerToken = data.managerToken;
        var workerToken = data.workerToken;
        var swarmJoin = {
          "AdvertiseAddr": "",
          "ListenAddr": "0.0.0.0:" +  data.swarmPort,
          "RemoteAddrs": [data.leader[0].ip + ":" + data.swarmPort],
          "JoinToken": ""
        }

        var workers = data.workers;
        if(workers.length > 0){
          for(var i in workers){
            setSwarm(workers[i], workerToken);
          }
        }
        var managers = data.managers;
        if(managers.length > 0 ){
          for(var i in managers){
             setSwarm(managers[i], managerToken);
          }
        }
      };

      /** @method  - init
      *  @description swarm 초기화
      *  @param {Object} data - 설정 데이터
      *  @param {Function} callback - 클라이언트로 보낼 callback
      */
      self.init = function (data, callback) {
        var hostconfig = data;
        console.log(hostconfig);

        var docker = getSwarmDocker(self, data.host, hostconfig);

        return docker.swarmInit(data).then(self.successCallback.bind(self, callback) , self.failureCallback.bind(self, callback));

      };

      /** @method  - Load
      *  @description swarm Load
      *  @param {Object} data - 설정 데이터
      *  @param {Function} callback - 클라이언트로 보낼 callback
      *  @return {Object} promise
      */
      self.load = function (data, callback){

        var hostconfig = {
          host : data.host,
          port : data.port
        }
        // console.log(data);
        var docker =  getSwarmDocker(self, data.host, hostconfig);

        return docker.swarmInspect().then(self.successCallback.bind(self, callback) , self.failureCallback.bind(self, callback));

      };

      /** @method  - leave
      *  @description swarm leave
      *  @param {Object} data - 설정 데이터
      *  @param {Function} callback - 클라이언트로 보낼 callback
      *  @return {Object} promise
      */
      self.leave = function (data, callback){
        return self.docker.swarmLeave({force : data}).then(self.successCallback.bind(self, callback) , self.failureCallback.bind(self, callback));
      };

      /** @method  - getToken
      *  @description swarm manager, worker token 정보 얻기
      *  @param {Object} data - 설정 데이터
      *  @param {Function} callback - 클라이언트로 보낼 callback
      *  @return {Object} promise
      */
      self.getToken = function (data, callback) {
        return new Promise(function (resolve, reject) {
          resolve(self.docker.swarmInspect());
        });
      };

      /** @method  - throwNode
      *  @description swarm throw 다른 호스트를 swarm에서 버림
      *  @param {Object} data - 설정 데이터
      *  @param {Function} callback - 클라이언트로 보낼 callback
      *  @return {Object} promise
      */
      self.throwNode = function (data, callback){

        var hostconfig = {
          host : data.host,
          port : data.port
        }
        var docker = getSwarmDocker(self, data.host, hostconfig);

        docker.swarmLeave({force : true}).then(self.successCallback.bind(self, callback) , self.failureCallback.bind(self, callback));
      };

    }).call(Swarm);

    var Node = Object.create(common);
    (function(){
      var self = this;
      self.getInfo = "getNode";
      self.getLists = "listNodes";
      self.attr = "ID"

      /** @method  - load
      *  @description node load
      *  @param {Object} data - 설정 데이터
      *  @param {Function} callback - 클라이언트로 보낼 callback
      *  @return {Object} dotask
      */
      self.load = function (data, callback){

        // self.setRemoteDocker(hostconfig);
        var hostconfig = data;
        var docker = getSwarmDocker(self, data.host, hostconfig);

        return new Promise(function(resolve, reject){
          resolve(docker.listNodes())
        }).then(self.successCallback.bind(self, callback) , self.failureCallback.bind(self, callback));
      };
      /** @method  - remove
      *  @description node remove
      *  @param {Object} data - 설정 데이터
      *  @param {Function} callback - 클라이언트로 보낼 callback
      *  @return {Object} dotask
      */
      self.remove = function (data, callback){
        // var hostconfig = data.leader;
        var docker = null;
        if(data.leader.host === getServerIp()){
          docker = self.docker;
        }else{
          var hostconfig = data.leader;
          self.setRemoteDocker(hostconfig);
          docker = self.remoteDocker;
        }
        var node = docker[self.getInfo](data.remove.nodeID);

        var opts = {
              "id" : data.remove.nodeID,
              "version" : data.remove.Version,
              "Role" : "worker",
              "Availability" : "pause"
            };
            // console.log(opts);
        node.update(opts).then((data)=>{
          node.remove({force : true}).then(self.successCallback.bind(self, callback) , self.failureCallback.bind(self, callback));
        }).catch((err)=>{
              console.log(err);
        });

      };


    }).call(Node);

    var Service = Object.create(common);

    (function(){
      var self = this;
      self.getInfo = "getService";
      self.getLists = "listServices";
      self.attr = "ID";

      /** @method  - create
      *  @description service create
      *  @param {Object} data - 설정 데이터
      *  @param {Function} callback - 클라이언트로 보낼 callback
      *  @return {Object} promise
      */
      self.create = function(data, callback){
        return (self.docker).createService(data).then(self.successCallback.bind(self, callback) , self.failureCallback.bind(self, callback));
      };

      /** @method  - remove
      *  @description service remove
      *  @param {Object} data - 설정 데이터
      *  @param {Function} callback - 클라이언트로 보낼 callback
      *  @return {Object} dotask
      */
      self.remove = function(data, callback){
        return self.doTask(data, callback, "remove");
      };

      /** @method  - remove
      *  @description service remove
      *  @param {Object} data - 설정 데이터
      *  @param {Function} callback - 클라이언트로 보낼 callback
      *  @return {Object} dotask
      */
      self.update = function(data, callback){

        var getService = (self.docker)[self.getInfo](data.Id);
        delete data.Id

        return getService.update( data).then(self.successCallback.bind(self, callback) , self.failureCallback.bind(self, callback));

      };

      /** @method  - inspect
      *  @description service inspect
      *  @param {Object} data - 설정 데이터
      *  @param {Function} callback - 클라이언트로 보낼 callback
      *  @return {Object} dotask
      */
      self.inspect = function(data, callback){
        return self.doTask(data, callback, "inspect");
      };

    }).call(Service);

    var Task = Object.create(common);
    (function(){
        var self = this;
        self.getInfo = "getTask";
        self.getLists = "listTasks";

        /** @method  - inspect
        *  @description task inspect
        *  @param {Object} data - 설정 데이터
        *  @param {Function} callback - 클라이언트로 보낼 callback
        *  @return {Object} dotask
        */
        self.inspect = function(data, callback){
            return self.doTask(data, callback, "inspect");
        };

   }).call(Task);


   //
   var lists = {
     "container" : Container,
     "network" : Network,
     "image" : Image,
     "volume" : Volume,
     "settings" : Settings,
     "swarm" : Swarm,
     "node" : Node,
     "service" : Service,
     "task" : Task
   }


module.exports = lists;
