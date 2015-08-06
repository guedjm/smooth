var mongoose = require('mongoose');
var sha1 = require('sha1');

var userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  firstName: String,
  sex: Boolean,
  address: [mongoose.Schema.Types.ObjectId],
  numTel: String,
  friends: [mongoose.Schema.Types.ObjectId],
  registrationDate: Date
});


userSchema.statics.createNewUser = function(email, password, name, firstName, sex, numTel, cb) {
  var now = new Date();
  userModel.create({
    email: email,
    password: sha1(password + email),
    name: name,
    firstName: firstName,
    sex: sex,
    address: [],
    numTel: numTel,
    friends: [],
    registrationDate: now
  }, cb);
};

var userModel = mongoose.model('User', userSchema);

module.exports = userModel;