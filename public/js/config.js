
var config = (function(){
  var container = {
        "Image" : "",
        "name" : "",
        "AttachStdin": false,
        "AttachStdout": true,
        "AttachStderr": true,
        "ExposedPorts": { },
        "Tty": false,
        "Cmd": [  ],
        "OpenStdin": true,
        "StdinOnce": true,
         "HostConfig" : {
           "LogConfig": {
                "Type": "json-file",
                "Config": {
                    "max-size": "10m"
                 }
                },
           "PortBindings" : {}
         }
  };

  var getContainer = function() {
    return container;
  };

  var setContainer = function (filter, portArray){

    var opts = container;
    opts.Image = filter.Image;
    opts.name = filter.name;
    opts.Cmd = [ filter.Cmd];

    console.log(portArray);
    for ( var i in portArray) {
      var portinfo = portArray[i].containerPort +"/"+ portArray[i].protocol;
      opts.ExposedPorts[portinfo] = {};
        opts.HostConfig.PortBindings[portinfo] = [{ "HostPort" : portArray[i].hostPort}];
    }

  };

  var network = {
          "Name" : "" ,
          "Driver": "" ,
          "Internal": false,
          "Ingress" : false,
          "Attachable" : false,
          "IPAM" : {
            // "Config": [
            //       {
            //           // "Subnet" : "",
            //           // "IPRange" : "",
            //           // "Gateway" : ""
            //       }
            //     ]
                // ,
                "Options" : {
                  // "parent" : "wlan0"
                }
              },
          "Options": {
                    "com.docker.network.bridge.default_bridge": "false",
                    "com.docker.network.bridge.enable_icc": "true",
                    "com.docker.network.bridge.enable_ip_masquerade": "true",
                    // "com.docker.network.bridge.host_binding_ipv4": "192.168.0.8",
                    // "com.docker.network.bridge.name": "k",
                    "com.docker.network.driver.mtu": "1500"
                  }
        };

  var getNetwork = function() {
    return network;
  }

  var setNetwork = function(filter) {
    var opts = network;
    opts.Name = filter.Name;
    opts.Driver = filter.Driver;
    opts.internal = filter.internal;
  }

  var image = {
          "term" : "",
          "limit" : "",
          "filters" : {
            "is-automated" : [],
            "is-official": [],
            "stars" : ["0"]
          }
  };

  var getImage = function(){
    return image;
  };

  var setImage = function(filter){
    var opts = image;
    opts.term = filter.term;
    opts.limit = filter.limit;
    opts.filters["is-automated"] = [filter["is-automated"]];
    opts.filters["is-official"] = [filter["is-official"]];
    if(filter.stars) {
      opts.filters["stars"] = filter.stars;
    }
  };

  var volume = {
    "Name" : "",
    "Driver" : ""
    // , "DriverOpts"  : ""
  };

  var getVolume = function(){
    return volume;
  }
  var setVolume = function (filter){
    var opts = volume;
    opts.Name = filter.Name;
    opts.Driver = filter.Driver;
  }

  var service = {
          "Name" : "",
          "TaskTemplate" : {
            "ContainerSpec" : {
              "Image" : "",
              "Command" : []
              // ,"HealthCheck" : {
              //   "Test" : ["NONE"]
              //   // ,
              //   // "Interval" : 30000000 ,
              //   // "Timeout" : 300000000 , //  1000000 = 1ms
              //   // "Retries" : 3,
              //   // "StartPeriod" : 10000000
              // }
            } ,
             "Resources": {
            "Limits": {},
            "Reservations": {}
            },
             "RestartPolicy": {},
                "Placement": {},
                "Networks" : []
          },
          "Mode": {
              "Replicated": {
                "Replicas": 1
              }
          },
          // "UpdateConfig": {
          //       "Parallelism": 2,
          //       "Delay": 1000000000,
          //       "FailureAction": "pause",
          //       "Monitor": 15000000000,
          //       "MaxFailureRatio": 0.15
          // },
          // "RollbackConfig": {
          //       "Parallelism": 1,
          //       "Delay": 1000000000,
          //       "FailureAction": "pause",
          //       "Monitor": 15000000000,
          //       "MaxFailureRatio": 0.15
          // },
          "EndpointSpec": {
                "Ports": [
                      // {
                      // "Protocol": "tcp",
                      // "PublishedPort": null,
                      // "TargetPort": null
                      // }
                  ]
            }
    };


    var getService = function(){
      console.log("getService");
      console.log(service);

      return service;
    };

    var setService = function (filter, portlists){
      var opts = service;
      opts.Name = filter.Name;
      opts.TaskTemplate.ContainerSpec.Image = filter.Image;
      opts.TaskTemplate.ContainerSpec.Command = [filter.Command];
      opts.Mode.Replicated.Replicas = filter.Replicas;
      opts.TaskTemplate.Networks = [ {"Target" : filter.Network }] ;

      for ( var i in portlists) {
        var portinfo = {
          "Protocol": portlists[i].protocol,
          "PublishedPort": parseInt(portlists[i].hostPort),
          "TargetPort": parseInt(portlists[i].containerPort)
        }
        opts.EndpointSpec.Ports.push(portinfo);
      }
      service = opts;
      console.log("setService");
      console.log(opts);
    };


  return {
    getContainer : getContainer,
    setContainer: setContainer,
    getNetwork : getNetwork,
    setNetwork : setNetwork,
    getImage : getImage,
    setImage : setImage,
    getVolume : getVolume,
    setVolume : setVolume,
    getService : getService,
    setService : setService
  };

})();




module.exports = config;
