import Likes from '../models/likes';

const likesController = {};

likesController.like = (req, res, next) => {
  const postId = req.body.postId;
  const userId = req.user._id;

  Likes.findOne({ _post: postId }, (err, existingPair) => {
    if (err) { return next(err); }

    if (existingPair){
      if(existingPair.likes.toString().includes(userId)){
        return res.status(422).send({ error: 'You already liked this photo' });
      }

      Likes.update({ _post: postId }, { $push: { 'likes': userId } }, (err) => {
        if (err){ return next(err); }
      });
      return res.send('Liked');
    }
    else {
      const likes = new Likes({
        _post: postId,
        likes: userId
      });

      likes.save((err) => {
        if (err) { return next(err); }

        return res.send('Liked');
      });
    }
  });
}

likesController.unlike = (req, res, next) => {
  const _user = req.user._id;
  const postId = req.body.postId;

  Likes.update({ _post: postId }, { $pull: { 'likes': _user } }, (err, likes) => {
    if (err) { return next(err); }
    return res.send(likes);
  });
}

likesController.likeOrUnlike = (req, res, next) => {
  const postId = req.body.postId;
  const userId = req.user._id;

  Likes.findOne({ _post: postId }, (err, existingPair) => {
    if (err) { return next(err); }

    if (existingPair){
      if(existingPair.likes.toString().includes(userId)){
        Likes.update({ _post: postId }, { $pull: { 'likes': _user } }, (err, likes) => {
          return res.send(likes);
        });
      }

      Likes.update({ _post: postId }, { $push: { 'likes': userId } }, (err) => {
        if (err){ return next(err); }
      });
      return res.send('Liked');
    }
    else {
      const likes = new Likes({
        _post: postId,
        likes: userId
      });

      likes.save((err) => {
        if (err) { return next(err); }

        return res.send('Liked');
      });
    }
  });
}

export default likesController;
