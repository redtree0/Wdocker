"use strict";

// function getServerIp() {
//     var ifaces = os.networkInterfaces();
//     var result = '';
//     for (var dev in ifaces) {
//         var alias = 0;
//         ifaces[dev].forEach(function(details) {
//             if (details.family == 'IPv4' && details.internal === false) {
//                 result = details.address;
//                 ++alias;
//             }
//         });
//     }
//
//     return result;
// }

// 메시지를 전송한 클라이언트를 제외한 모든 클라이언트에게 메시지를 전송한다
//socket.broadcast.emit('chat', msg);

// 메시지를 전송한 클라이언트에게만 메시지를 전송한다
// socket.emit('s2c chat', msg);

// 접속된 모든 클라이언트에게 메시지를 전송한다
// io.emit('s2c chat', msg);

// 특정 클라이언트에게만 메시지를 전송한다
// io.to(id).emit('s2c chat', data);
var serversocket = (function serversocket(socket) {
  this.socket = socket;
});


serversocket.prototype.listen = function(eventName, callback) {
    var socket =  this.socket;
    // console.log(eventName);
    socket.on(eventName, function(data, fn){
      console.log("do listen %s", eventName);
      console.log("get data %s", data);
      if(typeof fn === "function"){
        console.log("is called");
        callback(data, fn);
      }else {
        callback(data);
      }
    });

}

serversocket.prototype.sendEvent = function(eventName, data, callback) {
    var socket =  this.socket;
    socket.emit(eventName, data, callback);
}

serversocket.prototype.errTransmit = function(eventName, data, callback) {
    var socket =  this.socket;
    socket.emit("errTransmit", data, callback);
}



module.exports = serversocket;


//
// socket.on("CreateService", function(data){
//   console.log(data);
//   docker.createService(data).catch((err)=>{
//     console.log(err);
//   });
//
// });
//
// socket.on("RemoveService", function(data){
//
//   data.forEach((data)=>{
//     console.log(data.ID);
//     var service = docker.getService(data.ID);
//     service.remove().catch((err)=>{
//       console.log(err);
//     });
//   });
//
//
// });
// function getSwarmToken () {
//   var p = new Promise(function (resolve, reject) {
//     docker.swarmInspect().then((data) =>{
//     console.log(data);
//     resolve(data);
//     })
//   });
//   return p;
// }
//
// function getSwarmPort () {
//   var p = new Promise(function (resolve, reject) {
//     docker.swarmInspect().then((data) =>{
//     // console.log(data);
//     resolve(data);
//     })
//   });
//   return p;
// }
//
// socket.on("StartNode", function(node){
//   node.forEach((data)=>{
//     var role = data.Spec.Role;
//     var token = getSwarmToken();
//     token.then((data)=>{
//
//       var joinToken = "";
//       if(role =="worker") {
//         joinToken = (data.JoinTokens.Worker);
//       } else if (role == "manager") {
//         joinToken = (data.JoinTokens.Manager);
//       }
//       // resolve(joinToken);
//       var leave = "docker swarm leave;"
//       var join = "docker swarm join --token " + joinToken +" " +  "192.168.0.108" + ":2377"
//       console.log(join);
//       // console.log(ssh);
//       ssh.exec(leave, {
//         args : [join],
//         out: function(stdout) {
//           console.log(stdout);
//           ssh.end();
//         },
//         err : (err) =>{
//           console.log(err);
//           ssh.end();
//         }
//       }).start();
//     });
//     var node = docker.getNode(data.ID);
//     node.remove().catch((err)=>{
//       console.log(err);
//     });
//     // var hostname = os.hostname();
//     // var node = docker.getNode(hostname);
//     // node.inspect().then((data)=> {
//     //   var addr = data.ManagerStatus.Addr;
//     //   // console.log(data);
//     // });
//     var privateKey = fs.readFileSync('../../.ssh/id_rsa', "utf8");
//     var opts = {
//       "host" : data.Status.Addr,
//       "user" : "pirate",
//       "port" : "22",
//       "key" : privateKey
//     }  ;
//     // opts.key = privateKey;
//     var ssh = require('./ssh')(opts);
//
//
//   });
// });
//
// socket.on("RemoveNode", function(data){
//   data.forEach((data)=>{
//     var node = docker.getNode(data.ID);
//     node.remove({force: true}).catch((err)=>{
//       console.log(err);
//     });
//   });
// });
//
// socket.on("UpdateNode", function(node, json){
//
//   node.forEach((data)=>{
//     var node = docker.getNode(data.ID);
//     var opts = {
//       "id" : data.ID,
//       "version" : data.Version.Index,
//       "Role" : json.Role,
//       "Availability" : json.Availability
//     };
//
//     // console.log(data);
//     console.log(opts);
//     node.update(opts).catch((err)=>{
//       console.log(err);
//     });
//   });
// });
//
