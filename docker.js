

module.exports = function (opts) {
  var Docker = require('dockerode');
  var fs     = require('fs');

  var socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
  var stats  = fs.statSync(socket);

  if (!stats.isSocket()) {
    throw new Error('Are you sure the docker is running?');
  }

  if(opts) {
    var docker = new Docker({
      host : opts.host,
      port : opts.port,
      protocol: 'https'
      // ,socketPath: false
    });
    console.log("//////////////////////////////");
    console.log(opts);
    console.log("//////////////////////////////");
    console.log(docker);
    return docker;

  }
  var docker = new Docker({ socketPath: socket });

  return docker;
}
