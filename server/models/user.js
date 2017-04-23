import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const Schema = mongoose.Schema;

// Define user model
const userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true},
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  profilePic: { type: String, default: 'https://res.cloudinary.com/speedyninja711/image/upload/v1492392228/profile_default_vokpjj.png' },
  private: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false }
});

// On Save Hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function(next){
  // get acces to the user model - instance of the User model
  const user = this;

  // generate a salt then run callback
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }

    // has (encrypt) our password using the salt
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }

      //overwrite plain text password with encrypted password
      user.password = hash;
      next(); // go ahead and save model
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) { return callback(err); }

    callback(null, isMatch);
  });
}

userSchema.index({ username: 1 });

const User = mongoose.model('User', userSchema);

export default User;
