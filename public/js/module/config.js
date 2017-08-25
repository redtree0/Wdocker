
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
        "Labels" : {},
        "OpenStdin": true,
        "StdinOnce": true,
         "HostConfig" : {
          //  "Binds" : [], /// volume-name:container-dest
          "Mounts" :[
          //   {
          //     "target" : "",  // container Path
          //     "Source" : "", // volume_name
          //     "Type" : "" // volume
          // }
        ],
           "LogConfig": {
                "Type": "json-file",
                "Config": {
                    "max-size": "10m"
                 }
                },
           "PortBindings" : {}
         },
         "NetworkingConfig" : {
           "EndpointsConfig" : {
            //  "network" : {
            //    "NetworkID" : ""
            //  }
           }
         }
  };

  var getContainer = function() {
    return container;
  };

  var setContainer = function (filter, labellists, portArray){

    var opts = container;
    opts.Image = filter.Image;
    opts.name = filter.name;
    opts.Cmd = [ filter.Cmd];
    if(filter.hasOwnProperty("volume") && filter.hasOwnProperty("containerDest") ){
      opts.HostConfig.Mounts = [{
          "target" : filter.containerDest,
          "Source" : filter.volume,
          "Type" : "volume"
      }];
    }
    if(filter.hasOwnProperty("network")){
      opts.NetworkingConfig.EndpointsConfig.network = {};
      opts.NetworkingConfig.EndpointsConfig.network.NetworkID = filter.networkID;

    }


    for ( var i in portArray) {
      var portinfo = portArray[i].containerPort +"/"+ portArray[i].protocol;
      opts.ExposedPorts[portinfo] = {};
        opts.HostConfig.PortBindings[portinfo] = [{ "HostPort" : portArray[i].hostPort}];
    }
    var key = null;
    for ( var i in labellists) {
      key = labellists[i].key;
      opts.Labels[key] = labellists[i].value;
    }

    // console.log(opts);
  };

  var network = {
          "Name" : "" ,
          "Driver": "" ,
          "Internal": false,
          "Ingress" : false,
          "Attachable" : false,
          "Labels" : {},
          "IPAM" : {
            "Config": [
                  {
                      // "Subnet" : "",
                      // "IPRange" : "",
                      // "Gateway" : ""
                  }
                ]
                ,
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

  var setNetwork = function(filter, labellists) {
    var opts = network;
    opts.Name = filter.Name;
    opts.Driver = filter.Driver;
    opts.internal = filter.internal;
    opts.IPAM.Config = [{
      "Subnet" : filter.subnet,
      "IPRange" : filter.ipRange,
      "Gateway" : filter.gateway
    }]

    var key = null;
    for ( var i in labellists) {
      key = labellists[i].key;
      opts.Labels[key] = labellists[i].value;
    }
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
  var setVolume = function (filter, labellists ){
    var opts = volume;
    opts.Name = filter.Name;
    opts.Driver = filter.Driver;

    var key = null;
    for ( var i in labellists) {
      key = labellists[i].key;
      opts.Labels[key] = labellists[i].value;
    }
  }

  var service = {
          "Name" : "",
          "Labels" : {},
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
      return service;
    };

    var setService = function (filter, labellists, portlists){
      console.log(arguments);
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

      var key = null;
      for ( var i in labellists) {
        key = labellists[i].key;
        opts.Labels[key] = labellists[i].value;
      }

      console.log(opts);
      // service = opts;
    };
    var swarmInit = {
      "AdvertiseAddr" : window.location.hostname,
      "ListenAddr" :   "0.0.0.0:2377",
      "ForceNewCluster" : true
    };

    var getSwarmInit = function(){
      return swarmInit;
    };

    var setSwarmInit = function (filter, labellists, portlists){
      var opts = swarmInit;
      opts.ListenAddr = "0.0.0.0:" + filter.port;
      swarmInit = opts;
    };

    var swarmJoin = {
      "AdvertiseAddr": "",
      "ListenAddr": "0.0.0.0:",
      "RemoteAddrs": "",
      "JoinToken": ""
    }

    var getSwarmJoin = function(){
      return swarmJoin;
    };

    var setSwarmJoin = function (filter, labellists, portlists){
      var opts = swarmJoin;
      opts.ListenAddr = "0.0.0.0:" + filter.managerPort ;
      opts.AdvertiseAddr = filter.ip ;
      opts.RemoteAddrs = [window.location.hostname + ":"+ filter.managerPort];
      opts.JoinToken = filter.token;
      opts.port = filter.port;
      swarmJoin = opts;
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
    setService : setService,
    getSwarmInit : getSwarmInit,
    setSwarmInit : setSwarmInit,
    getSwarmJoin : getSwarmJoin,
    setSwarmJoin : setSwarmJoin,

  };

})();




module.exports = config;
