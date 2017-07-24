"use strict";

var docker = require('./docker')();
var spawn = require('child_process').spawn;
var fs = require('fs');
var path = require('path');
var os = require('os');
var p = require('./p');


function getServerIp() {
    var ifaces = os.networkInterfaces();
    var result = '';
    for (var dev in ifaces) {
        var alias = 0;
        ifaces[dev].forEach(function(details) {
            if (details.family == 'IPv4' && details.internal === false) {
                result = details.address;
                ++alias;
            }
        });
    }

    return result;
}

// 메시지를 전송한 클라이언트를 제외한 모든 클라이언트에게 메시지를 전송한다
//socket.broadcast.emit('chat', msg);

// 메시지를 전송한 클라이언트에게만 메시지를 전송한다
// socket.emit('s2c chat', msg);

// 접속된 모든 클라이언트에게 메시지를 전송한다
// io.emit('s2c chat', msg);

// 특정 클라이언트에게만 메시지를 전송한다
// io.to(id).emit('s2c chat', data);


var socket = function(io) {

  // connection event handler
// connection이 수립되면 event handler function의 인자로 socket인 들어온다


io.on('connection', function(socket) {
  console.log('check 1', socket.connected);
    function isFinished(){
      socket.emit("isFinished", true);
    }


    function errCatch(callback){
      callback.catch( (err) => {
        //console.log(err);
        console.log("error");
        socket.emit("errCatch", err);
      });
      return callback;
    }

      // 접속한 클라이언트의 정보가 수신되면
      socket.on('login', function(data) {

          console.log('Client logged-in:\n name:' + data.name + '\n userid: ' + data.userid);

          // socket에 클라이언트 정보를 저장한다
          socket.name = data.name;
          socket.userid = data.userid;
          isFinished();
      });


network(socket);
function network(socket) {
  socket.on('ConnectNetwork', function(data, fn) {
    // data.forEach((data)=>{
    //   var network = docker.getNetwork(data.Id);
    //
    //   network.connect({Container: t, EndpointConfig : {NetworkID : data.Id}}, (data, err) => {console.log(data); console.log(err);});
    // })
    console.log(data);
    p.network.connect(data, fn);

  });

  socket.on('DisconnectNetwork', function(data, t) {
    // data.forEach((data)=>{
    //   var network = docker.getNetwork(data.Id);
    //   network.disconnect({Container: t}, (data, err) => {console.log(data); console.log(err);});
    // })
  });

  socket.on('CreateNetwork', function(data, fn) {
      console.log("socket");
      p.network.create(data, fn);
  });

  socket.on('RemoveNetwork', function(data, fn) {
        // var network = docker.getNetwork(data.Id);
        // network.remove();
        console.log(data);
        p.network.remove(data, fn);

      //network.disconnect({id: "bridge", Container: "xx"}, (data, err) => {console.log(data); console.log(err);});
      //network.connect(options, (data) => {console.log(data);});
  });
}

images(socket);
function images(socket){
  socket.on("SearchImages", function(data, fn){
    console.log(data);
    p.image.search(data, fn);
    // docker.searchImages(data).then ( (data)=> {
    //   console.log(data);
    //   if(data) {
    //     socket.emit('searchResult', data);
    //   }
    // });
  });

  // function(err, stream) {
  //
  //   if (err) return done(err);
  //
  //   docker.modem.followProgress(stream, onFinished, onProgress);
  //
  //    function onFinished(err, output) {
  //      console.log("onFinished");
  //      done(socket);
  //    }
  //    function onProgress(event) {
  //         socket.emit("progress", event);
  //     }
  // }
  socket.on("PullImages", function(data, fn) {
    // console.log(data);
    data.forEach( (images) => {
      p.image.create({ "fromImage" : images.name , "tag" : "latest"},
      function(err, stream) {

        if (err) return done(err);

        docker.modem.followProgress(stream, onFinished, onProgress);

         function onFinished(err, output) {
           console.log("onFinished");
           socket.emit("progress", true);

         }
         function onProgress(event) {
              socket.emit("progress", event);
          }
      });
    });
  });
  socket.on("RemoveImages", function(data, fn) {
    p.image.remove(data, fn);
  });
}
container(socket);
function container(socket){
  console.log("contianer");
  socket.on('CreateContainer', function(data, fn) {
      if(data){
          p.container.create(data, fn);
      } else {
        console.log("args more request");
        fn(false);
      }
  });

   socket.on("StartContainer", function(data, fn){
      p.container.start(data, fn);
   });
   socket.on("StopContainer", function(data, fn){
       p.container.stop(data, fn);
   });
   socket.on("RemoveContainer", function(data, fn){
     p.container.remove(data, fn);
   });
   socket.on("KillContainer", function(data, fn){
     p.container.kill(data, fn);
   });
   socket.on("PauseContainer", function(data, fn){
     p.container.pause(data, fn);
   });
   socket.on("UnpauseContainer", function(data, fn){
     p.container.unpause(data, fn);
   });
   socket.on("StatsContainer", function(data, fn){
     p.container.stats(data, fn);
   });
   socket.on("ArchiveContainer", function(data, fn){
     p.container.getArchive(data, fn);
   });
}

dockerfile(socket);
function dockerfile(socket){
  socket.on("fileRead", function(data){
    var readFilePath = path.join(__dirname, "dockerfile", data);
    fs.readFile(readFilePath, 'utf8', (err, data) => {
       if (err) throw err;
       socket.emit("fileLoad",data);
     });
  });

  socket.on("CreateFile", function(data){

   var jsonPath = path.join(__dirname, "dockerfile", data.name);

    fs.writeFile(jsonPath, data.context, 'utf8', function(err) {
        console.log('비동기적 파일 쓰기 완료');
        done(socket);
    });

  });
  socket.on("RemoveFile", function(filename){
    var jsonPath = path.join(__dirname, "dockerfile", filename);
      fs.unlink(jsonPath);
      done(socket);
  })
  socket.on("build", (file)=>{
    console.log("build");
    console.log(file);
    var dirname = path.join(__dirname, "dockerfile");
    console.log(dirname);
        docker.buildImage({
        context: dirname,
        src: [file.name]
      }, {
        t: 'imgcwd'
      }, function(error, output) {
        if (error) {
          return console.error(error);
        }
        output.pipe(process.stdout);
      });
      done(socket);
  });
}

socket.on("swarmInit", function(port){


  // console.log(getServerIp());
  // var ip = getServerIp();
  var opts = {
    "ListenAddr" :   "eth0:" + "2377",
    "AdvertiseAddr" : "eth0:" + port,
    "ForceNewCluster" : true
  };
  docker.swarmInit(opts);
});

socket.on("swarmLeave", function(data){
  console.log(data);
  docker.swarmLeave({force : data});
});

socket.on("sshConnection", function(data){
      var privateKey = fs.readFileSync('../../.ssh/id_rsa', "utf8");
      var opts = data;
      opts.key = privateKey;
      // console.log(opts);
       console.log(opts);

      var ssh = require('./ssh')(opts);
      var cmd = "docker"
      // var args = {
      //   "token_manager" : "swarm join-token -q manager",
      //   "token_worker" : "swarm join-token -q worker",
      //   "join_manager" : "swarm join --token " + token + " " + getServerIp() + ":2377",
      //   "join_worker" : "swarm join --token " + token + " " + getServerIp() + ":2377"
      // }
      var join = "swarm join --token " + opts.token +" " +  "192.168.0.108" + ":2377"


      ssh.exec(cmd, {
            args : [join],
            out: function(stdout) {
              console.log(stdout);
              ssh.end();
            },
            err : (err) =>{
              console.log(err);
              ssh.end();
            }
        }).start();


});

socket.on("CreateService", function(data){
  console.log(data);
  docker.createService(data).catch((err)=>{
    console.log(err);
  });

});

socket.on("RemoveService", function(data){

  data.forEach((data)=>{
    console.log(data.ID);
    var service = docker.getService(data.ID);
    service.remove().catch((err)=>{
      console.log(err);
    });
  });


});
function getSwarmToken () {
  var p = new Promise(function (resolve, reject) {
    docker.swarmInspect().then((data) =>{
    console.log(data);
    resolve(data);
    })
  });
  return p;
}

function getSwarmPort () {
  var p = new Promise(function (resolve, reject) {
    docker.swarmInspect().then((data) =>{
    // console.log(data);
    resolve(data);
    })
  });
  return p;
}

socket.on("StartNode", function(node){
  node.forEach((data)=>{
    var role = data.Spec.Role;
    var token = getSwarmToken();
    token.then((data)=>{

      var joinToken = "";
      if(role =="worker") {
        joinToken = (data.JoinTokens.Worker);
      } else if (role == "manager") {
        joinToken = (data.JoinTokens.Manager);
      }
      // resolve(joinToken);
      var leave = "docker swarm leave;"
      var join = "docker swarm join --token " + joinToken +" " +  "192.168.0.108" + ":2377"
      console.log(join);
      // console.log(ssh);
      ssh.exec(leave, {
        args : [join],
        out: function(stdout) {
          console.log(stdout);
          ssh.end();
        },
        err : (err) =>{
          console.log(err);
          ssh.end();
        }
      }).start();
    });
    var node = docker.getNode(data.ID);
    node.remove().catch((err)=>{
      console.log(err);
    });
    // var hostname = os.hostname();
    // var node = docker.getNode(hostname);
    // node.inspect().then((data)=> {
    //   var addr = data.ManagerStatus.Addr;
    //   // console.log(data);
    // });
    var privateKey = fs.readFileSync('../../.ssh/id_rsa', "utf8");
    var opts = {
      "host" : data.Status.Addr,
      "user" : "pirate",
      "port" : "22",
      "key" : privateKey
    }  ;
    // opts.key = privateKey;
    var ssh = require('./ssh')(opts);


  });
});

socket.on("RemoveNode", function(data){
  data.forEach((data)=>{
    var node = docker.getNode(data.ID);
    node.remove({force: true}).catch((err)=>{
      console.log(err);
    });
  });
});

socket.on("UpdateNode", function(node, json){

  node.forEach((data)=>{
    var node = docker.getNode(data.ID);
    var opts = {
      "id" : data.ID,
      "version" : data.Version.Index,
      "Role" : json.Role,
      "Availability" : json.Availability
    };

    // console.log(data);
    console.log(opts);
    node.update(opts).catch((err)=>{
      console.log(err);
    });
  });
});


// force client disconnect from server
  socket.on('forceDisconnect', function() {
    socket.disconnect();
  })

  socket.on('disconnect', function() {
    console.log('user disconnected: ' + socket.name);
  });
/////////////////////////////////////

var shell = spawn('/bin/bash');
var stdin = shell.stdin;

 shell.on('exit', function (c, s){
   console.log(c);
   console.log(s);
 });

  shell.on('close', function (c, s){
    console.log("close");
    console.log(c);
  });

 shell['stdout'].setEncoding('ascii');
 shell['stdout'].on('data', function(data) {
   console.log("stdout");
   console.log(data);
   socket.emit('stdout', data);
 });

 shell['stderr'].setEncoding('ascii');
 shell['stderr'].on('data', function(data) {
   console.log(data);
   socket.emit('stderr', data);
 });


 socket.on('stdin', function(command) {
   console.log("stdin");
   console.log(command);

   stdin.write(command+"\n") || socket.emit('disable');
 });

 stdin.on('drain', function() {
   socket.emit('enable');
 });

 stdin.on('error', function(exception) {
   socket.emit('error', String(exception));
 });


/////////////////////////////////////

  });
};
module.exports = socket;
