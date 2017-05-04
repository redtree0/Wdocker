var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/mydb');
var db = mongoose.connection; // 2
db.once('open', function callback () {
console.log("mongo db connection OK.");
});


// Define Schemes
var userSchema = new mongoose.Schema({
  name: String,
  userid: { type: String, required: true},
  msg: String
});
var User = mongoose.model("User", userSchema);
/*
var testIns = new user({name : "asdf", userid : "asdf"});

testIns.save(function(err, testIns){
  console.log("save");
if(err) return console.error(err);
//testIns.speak();
});

user.find({ }, function(err, users) {
//  if(err)           return res.status(500).send(err);
//  if(!users.length) return res.status(404).send({ err: "User not found" });
  console.log(users);
//  res.send("User find successfully:\n" + users);
});
*/

// Create Model & Export
module.exports = User;
