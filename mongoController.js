
var dbLists = require("./mongo.js");

var dockerDB = dbLists.docker;
var systemDB = dbLists.system;

var mongo = function(db){
  this.db = db;
  this.instence = new db();
};

// var db = new docker();
// console.log(db);
// db.ip = req.body.ip;
// db.port = req.body.port;
// // db.user =req.body.user;
// // db.password = req.body.password;
// // console.log(req);
// db.save(function(err){
mongo.prototype.save = function(data, callback){
  var self = this;
  for(var i in data){
      self.instence[i] = data[i];
  }
  self.instence.save(function(err){
          if(err){
              // console.error(err);
              return err;
          }
          // res.render("settings.ejs");
      });
};

mongo.prototype.create = function(req, res) {
  var self = this;
  self.db.create({}, function(err, db) {
    if(err) { return handleError(res, err); }
    return res.json(db);
  });
};

mongo.prototype.find = function(data, callback) {
  var self = this;

  self.db.findOne(data, function(err, db){
        if(err) return ({error: 'database failure'});
        if(typeof callback === "function") {
          return  callback(db);
        }else {
          return  (db);
        }
    });
    // return res.json(db);
  // });
};

mongo.prototype.show = function(callback) {
  var self = this;
  // self.db.findById(req.params.id, function (err, db) {
  //   if(err) { return handleError(res, err); }
  //   if(!db) { return res.send(404); }

  self.db.find(function(err, db){
        if(err) return ({error: 'database failure'});
        if(typeof callback === "function") {
          return  callback(db);
        }else {
          return  (db);
        }
    });
    // return res.json(db);
  // });
};


mongo.prototype.destroy = function(callback) {
  var self = this;
    self.db.remove({}, function(err) {
            if (err) {
                // callback(err);
            } else {
                // callback('success');
            }
        }
    );
};

var docker = new mongo(dockerDB);
var system = new mongo(systemDB);

var lists = {
   "docker" : docker,
   "system" : system
};

module.exports = lists;
