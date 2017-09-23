var mongoose = require('mongoose');
 // DeprecationWarning: Mongoose: mpromise (mongoose's default promise library) is deprecated, plug in your own promise library instead: http://mongoosejs.com/docs/promises.html
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error',
  console.error
);

db.once('open', function(){
  console.log("Connected to mongod server");
});

// ,'users_test'
mongoose.connect('mongodb://localhost/nocker', function(err) {
    if (err) {
      throw err
    }
});

var Schema = mongoose.Schema;

var docker = new Schema({
  ip : String,
  port : Number
  // ,user : String,
  // password : String
});

var admin = new Schema({
  username : String,
  password : String,
  auth : {
    username : String,
    password : String,
    email : String,
    serveraddress : String
  }
});




module.exports = {
  "docker" : mongoose.model('docker', docker),
  // "system" : mongoose.model('system', system),
  // "auth" : mongoose.model('auth', auth),
  // "terminal" : mongoose.model('terminal', terminal),
  "admin" :  mongoose.model('admin', admin)
} ;
