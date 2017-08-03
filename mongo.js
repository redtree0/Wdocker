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


module.exports = mongoose.model('docker', docker);
