import Followers from '../models/followers';

const followersController = {};

followersController.getFollowers = (req, res, next) => {
  const _user = req.user._id;

  Followers.findOne({ _user }).populate({
    path: 'followers',
    select: 'username'
  }).exec((err, pair) => {
    if (err) { return next(err); }
    return res.send(pair);
  });
}

export default followersController;
