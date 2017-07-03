var docker = require('./docker');
var p = require('./promise');
var spawn = require('child_process').spawn;
var fs = require('fs');
var path = require('path');


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
    function done(socket){
      socket.emit("doneCatch", true);
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


  // 접속된 모든 클라이언트에게 메시지를 전송한다
  io.emit('login', data.name );
});



network(socket);
function network(socket) {
  socket.on('ConnectNetwork', function(data, t) {
    data.forEach((data)=>{
      var network = docker.getNetwork(data.Id);

      network.connect({Container: t, EndpointConfig : {NetworkID : data.Id}}, (data, err) => {console.log(data); console.log(err);});
    })
  });

  socket.on('DisconnectNetwork', function(data, t) {
    data.forEach((data)=>{
      var network = docker.getNetwork(data.Id);
      network.disconnect({Container: t}, (data, err) => {console.log(data); console.log(err);});
    })
  });

  socket.on('CreateNetwork', function(data) {
      console.log("socket");
      p(docker, 'CreateNetwork', data);
  });

  socket.on('RemoveNetwork', function(data) {
      data.forEach((data)=>{
        var network = docker.getNetwork(data.Id);
        network.remove();
      });
      //network.disconnect({id: "bridge", Container: "xx"}, (data, err) => {console.log(data); console.log(err);});
      //network.connect(options, (data) => {console.log(data);});
  });
}

images(socket);
function images(socket){
  socket.on("searchImages", function(data){
    console.log(data);
    docker.searchImages(data).then ( (data)=> {
      console.log(data);
      if(data) {
        socket.emit('searchResult', data);
      }
    });
  });

  socket.on("pullImages", function(data) {
    console.log(data);
    data.forEach( (images) => {

      docker.pull(images.name, {"tag" : "latest"},function(err, stream) {

        if (err) return done(err);

        docker.modem.followProgress(stream, onFinished, onProgress);

         function onFinished(err, output) {
           console.log("onFinished");
         }
         function onProgress(event) {
              socket.emit("progress", event);
          }
        });
    });
  });
  socket.on("removeImages", function(data) {
    data.forEach( (images) => {
      var multiTag = images.RepoTags;
      multiTag.forEach( (singleTag)=> {
        var searchimage = docker.getImage(singleTag);
        searchimage.remove().catch( (err) => {
            socket.emit("errCatch", err);
        }).then(()=>{
          //console.log("remove");
        });
      });
    });
  });
}
container(socket);
function container(socket){
  socket.on('CreateContainer', function(data) {

      p(docker, 'CreateContainer', data);
  });


   socket.on("dstart", function(data){
    // console.log(data);
     p(docker, "dstart", data).then ( (container) => {
       container.forEach ( (container) => {
           errCatch(container.start());
       });
     });
   });
   socket.on("dstop", function(data){
    // console.log(data);
     p(docker, "dstop", data).then ( (container) => {
       container.forEach ( (container) => {
           errCatch(container.stop());
       });
     });
   });
   socket.on("dremove", function(data){
     console.log("remove");
     console.log(data);
     p(docker, "dremove", data).then ( (container) => {
       container.forEach ((container) => {
         setTimeout( () => {errCatch(container.remove()); }, "500");
       });
       done(socket);
     });
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

socket.on("swarmInit", function(data){
  console.log(data);
  var opts = {
    "ListenAddr" : "0.0.0.0:4567",
    "AdvertiseAddr" : "192.168.0.8:4567"
  };
  docker.swarmInit(opts);
});

socket.on("Access", function(data){
  console.log(data);
  var opts = {
    host: 'http://192.168.0.11',
    port: process.env.DOCKER_PORT || 2375,
  };
  // var opts = {
  //   "ListenAddr" : "0.0.0.0:4567",
  //   "AdvertiseAddr" : "192.168.0.8:4567",
  //   "JoinToken" : "1234"
  // };
  var docker = require('./docker')(opts);
  docker.listContainers({all: true}).then((data)=>{
    console.log(data);
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
