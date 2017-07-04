///// @ opts
///// host, user, password, port, privatekey
module.exports = function(opts) {
  var SSH = require('simple-ssh');


  // opts = json, attr = host, user, password, port, privatekey
  var ssh = new SSH(opts);



  return ssh;
  // ssh.exec('docker', {
  //     args: ['swarm', 'join-token', '-q', 'worker'],
  //     out: function(stdout) {
  //         console.log(stdout);
  //     },
  //     err : (err) =>{
  //       console.log(err);
  //     }
  // }).start();
}
