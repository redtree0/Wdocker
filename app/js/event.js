"use strict";

var Socket = require("./socket");

var p = require('./dockerEvent');
var mongo = require("./mongoController");
var os = require("os");


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
  // console.log(io);
  //  io.on('connection', function(socket) {
  function onConnect(socket) {
				socket.handshake.secure = true;
				// console.log("socket");
				var token = socket.handshake.query.token;
				// console.log(token);
        if(!token){
          return ;
        }
        new Promise(function(resolve, reject){
          mongo.docker.show(resolve)
        }).then((data)=>{

              var hostinfo = data.filter((value)=>{
                if(value._id.toString() === token){
                  return value;
                }
              });

              var server = new Socket(socket);
              var host = null;

              if(hostinfo.length !== 0){
                host = hostinfo[0].ip;
              }else {
                host =  getServerIp();
              }
              container(server, host);
              network(server, host);
              image(server, host)
              volume(server, host);
              dockerfile(server);
              terminal(server);
              settings(server);
              swarm(server);
              node(server);
              service(server, host);
              task(server);
        });

        return ;
  }

  var container = function(server, host){

		var container = p.container;
		container.getTaskDocker(host, (docker)=>{
          // console.log(docker);
					container.docker = docker;
					server.listen('CreateContainer', function(data, fn){
								container.create(data, fn);
					});
					server.listen('StartContainer', function(data, fn){
							 container.start(data, fn);
					});

					server.listen("StopContainer", function(data, fn){
							 container.stop(data, fn);
					});

					server.listen("RemoveContainer", function(data, fn){
							container.remove(data, fn);
					});
					server.listen("KillContainer", function(data, fn){
							container.kill(data, fn);
					});
					server.listen("PauseContainer", function(data, fn){
							container.pause(data, fn);
					});
					server.listen("UnpauseContainer", function(data, fn){
							container.unpause(data, fn);
					});
					server.listen("StatsContainer", function(data, fn){
							container.stats(data, fn);
					});
					server.listen("ArchiveContainer", function(data, fn){
							container.getArchive(data, fn);
					});

					server.listen("AttachContainer", function(data, fn){

              // var containerId = (data).toString().substring(0, 12);
              // console.log("attach");

              function stdin(stream, container){

                  server.listen("AttachStdin", (data)=>{
                    // console.log("listen");
                    // console.log(data);
                    if(data === "exit"){
                      container.stop();
                    }else {
                      stream.write(data + "\n");
                    }
                  });

							}


							function stdout(stream){
									// server.sendEvent("AttachStdout",  stream.pipe(stdout));
									// stream.setEncoding('ascii');
									stream.on('data', function(data){
                    var result = data.toString();
                    // console.log(result);
                    server.sendEvent("AttachStdout", result);

									});
									stream.on('end', function(end) {
										server.sendEvent("AttachEnable", "enable");
								 });

							}

							function stderr(stream){
									// stream.setEncoding('ascii');
									stream.on('error', function(err){
										server.sendEvent("AttachStderr", err.toString());
									});
							}
							fn(true);
							container.attach(data, stdin, stdout, stderr);

					});
		});

  };
  // });


var network = function(server, host){
		var network = p.network;
		network.getTaskDocker(host, (docker)=>{

					network.docker = docker;
			    server.listen("ConnectNetwork", function(data, fn){
			          network.connect(data, fn);
			    });

			    server.listen("DisconnectNetwork", function(data, fn){
			          network.disconnect(data, fn);
			    });

			    server.listen('CreateNetwork', function(data, fn) {
			        	network.create(data, fn);
			    });

			    server.listen('RemoveNetwork', function(data, fn) {
			          network.remove(data, fn);
			    });

	});
};

var image = function(server, host){
	 	 var image = p.image;
		 image.getTaskDocker(host, (docker)=>{
					 image.docker = docker;

				   server.listen("SearchImage", function(data, fn){
				     		image.search(data, fn);
				   });


				   server.listen("PullImage", function(data, fn) {
             function onProgress(progress){
               server.sendEvent("progress", progress);
             }
								image.create(data, onProgress, fn);
			     });

			     server.listen("RemoveImage", function(data, fn) {
			       		image.remove(data, fn);
			     });

           server.listen("TagImage", function(data, fn) {
			       		image.tag(data, fn);
			     });

					 server.listen("PushImage", function(data, fn) {
                function onProgress(progress){
                  server.sendEvent("pushingImage", progress);
                }

						 		image.push(data, onProgress, fn);
					 });

					 server.listen("build", function(data, fn){
							 function onProgress(progress){

								 server.sendEvent("buildingImage", progress);
							 }
                // console.log(data);
						 		image.build(data, onProgress);
					 });
	 });

};

var volume = function(server, host){
		var volume = p.volume;
		volume.getTaskDocker(host, (docker)=>{
				volume.docker = docker;
		     server.listen("CreateVolume", function(data, fn){
		          volume.create(data, fn);
		    });

		     server.listen("RemoveVolume", function(data, fn){
		        volume.remove(data, fn);
		    });
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
	 var space  = "";
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

   try{
     if(fs.lstatSync(jsonPath).isDirectory()){
      //  console.log("filter");
       return fn({"statusCode" : "500"});
     }
   }catch(e){
     console.log(e);
   }
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
    });
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

	            var parentPath = path.dirname(json.path);
	            var parentDir = tree.setLeaf(ID(".."), "..","#", "directory", parentPath);

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
					// var home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE || "/home";
					var home = "/home";

					var workspace = path.join(home, "dockerfile");

					if(!fs.existsSync(workspace)){
						fs.mkdir(workspace, function(err) {});
					}
	        if (data === ""){

	          tree = dirTree(workspace, { exclude:/^\./  } );
	          // tree = dirTree(home, { exclude:/^\./ , extensions:/\W/ } ); file only
	        } else if (data  !== null){

						if( (data) === home){
							tree = dirTree(workspace, { exclude:/^\./ } );
						}else {
							tree = dirTree(data, { exclude:/^\./ } );
						}
						// console.log(path.dirname(data) === path.join(home));
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

	var settings = p.settings;

	server.listen('PING', function(data, fn) {
			settings.ping(data, fn);
	});

	server.listen('DELETE', function(data, fn) {
			settings.delete(data, fn);
	});



	server.listen('authCheck', function(data, fn) {
		settings.authCheck(data, fn);
	});


}



var swarm = function(server){
	var swarm = p.swarm;

	server.listen("UpdateSwarm", function(data , fn){
		swarm.update(data, fn);
	});

	server.listen("InitSwarm", function(data , fn){
		swarm.init(data, fn);
	});

	server.listen("LoadSwarm", function(data , fn){
		swarm.load(data, fn);
	});

	server.listen("LeaveSwarm", function(data, fn){
		// var opts = {force : data};
		swarm.leave(data, fn);
	});
	//
	// server.listen("JoinSwarm", function(data, fn){
	// 	p.swarm.join(data, fn);
	// });

	server.listen("ThrowNode", function(data, fn){
		swarm.throwNode(data, fn);
	});
}

var node = function(server){
	var node = p.node;

	server.listen("LoadNode", function(data , fn){
		// console.log(data);
		node.load(data, fn);
	});

	server.listen("RemoveNode", function(data, fn){
		node.remove(data, fn);
	});


};

var service = function(server, host){
	var service = p.service;
	service.getTaskDocker(host, (docker)=>{
			service.docker = docker;
			server.listen("CreateService", function(data, fn){
				service.create(data, fn);
			});

			server.listen("RemoveService", function(data, fn){
				service.remove(data, fn);
			});

			server.listen("UpdateService", function(data, fn){
				service.update(data, fn);
			});

	});
}

var task = function(server){
	// server.listen("")
}


module.exports = eventLists;
