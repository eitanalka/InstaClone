import jwt from 'jwt-simple';
import User from '../models/user';
import config from '../config';
import Datauri from 'datauri';
import cloudinary from 'cloudinary';
import path from 'path';

const dUri = new Datauri();

const userController = {};

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

userController.signin = (req, res, next) => {
  // User has already had their username and password auth'd
  // We just need to give them a token
  res.send({ token: tokenForUser(req.user) });
}

userController.signup = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const firstName = req.body.firstname;
  const lastName = req.body.lastname;
  if (!username || !password) {
    return res.status(422).send({ error: 'You must provide username and password' });
  }

  if (username.includes(' ')){
    return res.status(422).send({ error: 'Your username cannot contain spaces'});
  }

  // See if a user with the given username exists
  User.findOne({ username }, (err, existingUser) => {
    if (err) { return next(err); }

    // If a user with username does exist, return an error
    if (existingUser) {
      return res.status(422).send({error: 'Username is in use'});
    }

    // If a user with with username does NOT exist, create and save user record
    const user = new User({
      username,
      password,
      firstName,
      lastName
    });

    user.save((err) => {
      if (err) { return next(err); }

      // Respond to request indicating the user was created
      res.json({ token: tokenForUser(user), userId: user._id});
    });
  });
}

userController.feature = (req, res, next) => {
  res.send({ message: req.user._id});
}

userController.uploadProfilePic = (req, res, next) => {
  if (req.file) {
    const extension = (path.extname(req.file.originalname).toString());
    if(extension !== '.jpg' && extension !== '.jpeg' && extension !== '.png'){
      return res.status(422).send({ error: 'Please provide an image of file type .jpg, .jpeg, or .png' })
    }
    dUri.format(extension, req.file.buffer); // sets file up for cloudinary upload
    cloudinary.uploader.upload(dUri.content, (result) => { // upload to cloudinary
      User.findByIdAndUpdate(req.user._id, { profilePic: result.url }, (err, user) => { // update profile pic on user
        if (err) { return next(err); }
      });
    }, { width: 500, height: 500, crop: "limit" }); // image transformations

    return res.send('Upload succesful')
  }
  res.send({ error: 'Missing file' });
}

export default userController;
