import Following from '../models/following';
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

    if(existingPair) {
      if(existingPair.following.toString().includes(followingId)){
        return res.status(422).send({ error: 'You already following this user' });
      }

      Following.update({ _user }, { $push: { 'following': followingId } }, (err) => {
        if (err) { return next(err); }
      });
      return res.send('Follow successful');
    }
    else {
      const following = new Following({
        _user,
        following: followingId
      });

      following.save((err) => {
        if (err) { return next(err); }

        return res.send(following);
      });
    }

  });
}

followingController.getFollowing = (req, res, next) => {
  const _user = req.user._id;

  Following.findOne({ _user }, (err, pair) => {
    if (err) { return next(err); }
    return res.send(pair);
  });
}

followingController.unfollow = (req, res, next) => {
  const _user = req.user._id;
  const followingId = req.body.followingId;

  Following.update({ _user }, { $pull: { 'following': followingId } }, (err, following) => {
    return res.send(following);
  });
}

export default followingController;
