import Following from '../models/following';
import Followers from '../models/followers';
import Requests from '../models/requests';
import Notifications from '../models/notifications';
import User from '../models/user';
import mongoose from 'mongoose';

const followingController = {};

followingController.follow = (req, res, next) => {
  const _user = req.user._id;
  const followingId = req.body.followingId

  if (_user === followingId) {
    return res.status(422).send({ error: 'You cannot follow yourself' });
  }
  Following.findOne({ _user }, (err, existingPair) => {
    if (err) { return next(err); }

    if(existingPair.following.toString().includes(followingId)){
      return res.status(422).send({ error: 'You are already following this user' });
    }

    User.findById(followingId, (err, user) => {
      if (err) { return next(err); }

      if (user.private){
        Requests.findOne({ _user: followingId }, (err, requests) => {
          if(requests.requests.toString().includes(_user)){
            return res.send(`You already requested to follow ${user.username}`);
          }
          else {
            Notifications.update({ _user: followingId }, { $push: { 'requests': _user } }, (err) => {
              if (err) { return next(err); }
            });
            Requests.update({ _user: followingId }, { $push: { 'requests': _user } }, (err) => {
              if (err) { return next(err); }
              return res.send(`You requested to follow ${user.username}`);
            });
          }
        });

      }
      else {
        Followers.update({ _user: followingId }, { $push: { 'followers': _user } }, (err) => {
          if (err) { return next(err); }
        });

        Following.update({ _user }, { $push: { 'following': followingId } }, (err) => {
          if (err) { return next(err); }
        });
        return res.send('Follow successful');
      }
    });
  });
}

followingController.getFollowing = (req, res, next) => {
  const _user = req.user._id;

  Following.findOne({ _user }).populate({
    path: 'following',
    select: 'username'
  }).exec((err, pair) => {
    if (err) { return next(err); }
    return res.send(pair);
  });
}

followingController.unfollow = (req, res, next) => {
  const _user = req.user._id;
  const followingId = req.body.followingId;

  Followers.update({ _user: followingId }, { $pull: { 'followers': _user } }, (err) => {
    if (err) { return next(err); }
  });

  Following.update({ _user }, { $pull: { 'following': followingId } }, (err, following) => {
    if (err) { return next(err); }
    return res.send(following);
  });
}

export default followingController;
