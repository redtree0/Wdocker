"use strict";

var Socket = require("./socket");
// var docker = require('./docker')();
// var spawn = require('child_process').spawn;
// var fs = require('fs');
// var path = require('path');
// var os = require('os');
var p = require('./p');
const eventName = {
	STARTCONTAINER : 'StartContainer',
	STOPCONTAINER: 'StopContainer'
}


var eventLists = function(io){
  io.on('connection', onConnect);
  // // force client disconnect from server
  io.on('forceDisconnect', function(socket) {
      socket.disconnect();
  })

  io.on('disconnect', function(socket) {
      console.log('user disconnected: ' + socket.name);
  });

};
  // console.log(io);
  //  io.on('connection', function(socket) {
  function onConnect(socket) {

        var server = new Socket(socket);

        container(server);
        network(server);
        image(server)
        volume(server);
        dockerfile(server);
				terminal(server);
				settings(server);
				swarm(server);
  }

  var container = function(server){
		server.listen('CreateContainer', function(data, fn){
				 p.container.create(data, fn);
		});
      server.listen('StartContainer', function(data, fn){
           p.container.start(data, fn);
      });

      server.listen("StopContainer", function(data, fn){
           p.container.stop(data, fn);
      });

      server.listen("RemoveContainer", function(data, fn){
          p.container.remove(data, fn);
      });
      server.listen("KillContainer", function(data, fn){
          p.container.kill(data, fn);
      });
      server.listen("PauseContainer", function(data, fn){
          p.container.pause(data, fn);
      });
      server.listen("UnpauseContainer", function(data, fn){
          p.container.unpause(data, fn);
      });
      server.listen("StatsContainer", function(data, fn){
          p.container.stats(data, fn);
      });
      server.listen("ArchiveContainer", function(data, fn){
          p.container.getArchive(data, fn);
      });
  };
  // });


var network = function(server){

    server.listen("ConnectNetwork", function(data, fn){
          p.network.connect(data, fn);
    });

    server.listen("DisconnectNetwork", function(data, fn){
          p.network.disconnect(data, fn);
    });

    server.listen('CreateNetwork', function(data, fn) {
        p.network.create(data, fn);
    });

    server.listen('RemoveNetwork', function(data, fn) {
          p.network.remove(data, fn);
    });
};

var image = function(server){
  server.listen("SearchImages", function(data, fn){
     p.image.search(data, fn);
   });

   server.listen("PullImages", function(data, fn) {
		 			console.log(data);
         p.image.create(data,
         function(err, stream) {
					 console.log(stream);
           if (err) return console.log(err);
					 var docker = require("./docker")();
					 console.log(server);
           docker.modem.followProgress(stream, onFinished, onProgress);

            function onFinished(err, output) {
              console.log("onFinished");
              server.sendEvent("progress", true);

            }
            function onProgress(event) {
							   console.log(event);
                 server.sendEvent("progress", event);
             }
         });
     });

     server.listen("RemoveImages", function(data, fn) {
       p.image.remove(data, fn);
     });
};

var volume = function(server){

     server.listen("CreateVolume", function(data, fn){
          p.volume.create(data, fn);
    });

     server.listen("RemoveVolume", function(data, fn){
        p.volume.remove(data, fn);
    });
};


var dockerfile = function(server) {
  var fs = require('fs');
  var path = require('path');

  server.listen("ReadFile", function(data, fn){
    var readFilePath = path.join(data);
    fs.readFile(readFilePath, 'utf8', (err, data) => {
       if (err) throw fn(err);
       fn(data);
     });
  });

  server.listen("CreateFile", function(data, fn){
   var jsonPath = path.join(data.path, data.name);
	 var space  = ""
    fs.writeFile(jsonPath, space, 'utf8', function(err) {
        // fn(true);
    });
  });

	server.listen("CreateDirectory", function(data, fn){
		var jsonPath = path.join(data.path, data.name);
    fs.mkdir(jsonPath, function(err) {
        // fn(true);
    });
  });



  server.listen("UpdateFile", function(data, fn){
   var jsonPath = path.join(data.path);

    fs.writeFile(jsonPath, data.context, 'utf8', function(err) {
        fn(true);
    });
  });

  var rmdir = function(dir) {
  	var list = fs.readdirSync(dir);
  	for(var i = 0; i < list.length; i++) {
  		var filename = path.join(dir, list[i]);
  		var stat = fs.statSync(filename);

  		if(filename == "." || filename == "..") {
  			// pass these files
  		} else if(stat.isDirectory()) {
  			// rmdir recursively
  			rmdir(filename);
  		} else {
  			// rm fiilename
  			fs.unlinkSync(filename);
  		}
  	}
  	fs.rmdirSync(dir);
  };

  server.listen("RemoveFile", function(data, fn){
    var jsonPath = path.join(data.path);
      if(data.type === "file"){
        fs.unlink(jsonPath);
      }else if(data.type === "directory"){
        rmdir(jsonPath);
      }
      fn(true);
  });

	server.listen("RenameFile", function(data, fn){
		var origin = path.join(data.origin);
   	var renew = path.join(data.renew);

    fs.rename(origin, renew, function(err) {
        // fn(true);
    });
  });

  server.listen("build", function(data, fn){
    console.log(data);
    p.image.build(data, function(err, stream) {
			if(err) return fn(err);
					// console.log(stream);
					// 	var docker = require("./docker")();

						var docker = require("./docker")();
						// console.log(server);
						docker.modem.followProgress(stream, onFinished, onProgress);

						 function onFinished(err, output) {
							 console.log("onFinished");
							 server.sendEvent("buildingImage", true);

						 }
						 function onProgress(event) {
							 console.log(event);
									server.sendEvent("buildingImage", event);
							}
  				});
    	fn(true);
  });


	      function jstreeList(json, parentid, leafs){
	          if (json === null) {
	            // console.log("done");
	            return null;
	          }
	          if( arguments.length === 2 ){
	            var lists = [];
	          }else {
	            var lists = leafs;
	          }
	          var ID = function () {
	            return '_' + Math.random().toString(36).substr(2, 9);
	          };
	          // console.log(JSON.stringify(json));
	              var tree = function (id, text, parent, path) {

	              function getDepth(path) {
	                var splitPath = path.split("/");

	                return splitPath.filter((val)=>{if(val) {return val;}}).length;
	              }

	                var id = null;
	                var text = null;
	                var parent = null;
	                var type = null;
	                var path = null;
	                var depth = null;
	                var getLeaf = function() {
	                    return { id : id, text : text, parent : parent, type : type, path : path, depth : depth};
	                }
	                var setLeaf = function(_id, _text, _parent, _type, _path) {
	                       id = _id;
	                       text = _text;
	                       parent = _parent;
	                       type = _type;
	                       path = _path;
	                       depth = getDepth(_path);
	                       return getLeaf();
	                }
	                var getId = function () {
	                  return id;
	                }
	                return { getLeaf : getLeaf, setLeaf : setLeaf ,getId : getId };
	            }();

	        if(parentid === null) {
	            // var splitPath = json.path.split("/").filter((val)=>{if(val) {return val;}});
	            // splitPath.pop();
	            // var parentPath = splitPath.join("/");
	            var parentPath = path.dirname(json.path);
	            var parentDir = tree.setLeaf(ID(".."), "..","#", "directory", parentPath);
	            // console.log(data.getId());
	            // console.log(parentDir);
	            var id = ID(json.name);
	            var workingDir = tree.setLeaf(id, json.name,"#", "directory", json.path);

	            lists.push(parentDir);
	            lists.push(workingDir);
	            var parentid = tree.getId();

	        }

	        var child = json.children;
	        if(typeof child === undefined) {
	          // console.log("no have child");
	          return null;
	        }

	        for(var i in child) {
	          var leaf = tree.setLeaf(ID(child[i].name), child[i].name, parentid, child[i].type , child[i].path);
	          // var leafNode = data.getLeaf();
	          if(child[i].hasOwnProperty("extension")){
	            leaf.icon = "glyphicon glyphicon-file"
	          }
	          lists.push(leaf);
	          jstreeList(child[i], tree.getId(), lists);

	        }
	        return lists;
	      }
	//
	//       /////////////////////////////////////// js tree
	        server.listen('dirtree', function(data, fn) {

	        const PATH = require('path');
	        const dirTree = require('directory-tree');
	        var tree = null;
	        console.log("path %s", data);
	        if (data == ""){
	           var home = '/home/pirate/dockerfile/';
	          //  var home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
	          tree = dirTree(home, { exclude:/^\./  } );
	          // tree = dirTree(home, { exclude:/^\./ , extensions:/\W/ } ); file only
	        } else if (data  != null){
	          console.log(PATH.join(data));
	          tree = dirTree(data, { exclude:/^\./ } );
	        }
	        var lists = jstreeList(tree, null);
	        // console.log(lists);
	        fn(lists);
	      });
}

var terminal = function (server) {
		var spawn = require('child_process').spawn;
	 var shell = spawn('/bin/bash');
	 var stdin = shell.stdin;
	//  console.log(server);
	 shell.on('exit', function (c, s){
	   console.log(c);
	   console.log(s);
	 });

	  shell.on('close', function (c, s){
	    console.log(c);
	  });

	 shell['stdout'].setEncoding('ascii');
	 shell['stdout'].on('data', function(data) {
	   server.sendEvent('stdout', data);
	 });

	 shell['stderr'].setEncoding('ascii');
	 shell['stderr'].on('data', function(data) {
	   server.sendEvent('stderr', data);
	 });


	 server.listen('stdin', function(command) {
	   stdin.write(command+"\n") || server.sendEvent('disable');
	 });

	 stdin.on('drain', function() {
	   server.sendEvent('enable');
	 });

	 stdin.on('error', function(exception) {
	   server.sendEvent('error', String(exception));
	 });

}

var settings = function(server){
	server.listen('PING', function(data, fn) {

			p.settings.ping(data, (err, data)=> {
				fn({err : err, data: data});
			});

	});

	server.listen('DELETE', function(data, fn) {

			p.settings.delete(data, fn);

	});
}



var swarm = function(server){

	function getServerIp() {
			var os = require("os");
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


	server.listen("swarmInit", function(data , fn){
		if(typeof data === "number"){
			var data = port
		}else {
			data = "2377"
		}
	  var ip = getServerIp();
	  var opts = {
			"AdvertiseAddr" : ip,
	    "ListenAddr" :   "0.0.0.0:"+ data,
	    "ForceNewCluster" : true
	  };
	  p.swarm.create(opts, fn);
	});

	server.listen("swarmLeave", function(data, fn){
		var opts = {force : data};
		p.swarm.leave(opts, fn);
	});

	server.listen("swarmJoin", function(data, fn){
		// var opts = {force : data};
		console.log(data);
		p.swarm.join(data, fn);
	});
}

// var node = function(server){
//   server.listen("StartNode", function(node){
//     node.forEach((data)=>{
//       var role = data.Spec.Role;
//       var token = getSwarmToken();
//       token.then((data)=>{
//
//         var joinToken = "";
//         if(role =="worker") {
//           joinToken = (data.JoinTokens.Worker);
//         } else if (role == "manager") {
//           joinToken = (data.JoinTokens.Manager);
//         }
//         // resolve(joinToken);
//         var leave = "docker swarm leave;"
//         var join = "docker swarm join --token " + joinToken +" " +  "192.168.0.108" + ":2377"
//         console.log(join);
//         // console.log(ssh);
//         ssh.exec(leave, {
//           args : [join],
//           out: function(stdout) {
//             console.log(stdout);
//             ssh.end();
//           },
//           err : (err) =>{
//             console.log(err);
//             ssh.end();
//           }
//         }).start();
//       });
//       var node = docker.getNode(data.ID);
//       node.remove().catch((err)=>{
//         console.log(err);
//       });
//       // var hostname = os.hostname();
//       // var node = docker.getNode(hostname);
//       // node.inspect().then((data)=> {
//       //   var addr = data.ManagerStatus.Addr;
//       //   // console.log(data);
//       // });
//       var privateKey = fs.readFileSync('../../.ssh/id_rsa', "utf8");
//       var opts = {
//         "host" : data.Status.Addr,
//         "user" : "pirate",
//         "port" : "22",
//         "key" : privateKey
//       }  ;
//       // opts.key = privateKey;
//       var ssh = require('./ssh')(opts);
//
//
//     });
//   });
//
//   server.listen("RemoveNode", function(data){
//     data.forEach((data)=>{
//       var node = docker.getNode(data.ID);
//       node.remove({force: true}).catch((err)=>{
//         console.log(err);
//       });
//     });
//   });
//
//   server.listen("UpdateNode", function(node, json){
//
//     node.forEach((data)=>{
//       var node = docker.getNode(data.ID);
//       var opts = {
//         "id" : data.ID,
//         "version" : data.Version.Index,
//         "Role" : json.Role,
//         "Availability" : json.Availability
//       };
//
//       // console.log(data);
//       console.log(opts);
//       node.update(opts).catch((err)=>{
//         console.log(err);
//       });
//     });
//   });
// }






module.exports = eventLists;
