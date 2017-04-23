import Comment from '../models/comment';
import Post from '../models/post';
import mongoose from 'mongoose';

const commentController = {};

commentController.createComment = (req, res, next) => {
  const text = req.body.text;
  const _creator = req.user._id;
  const _post = req.body.postId;

  if (!text) {
    res.status(422).send({ error: 'Please enter text' });
  }

  Post.findOne({ _id: _post }, (err, existingPost) => {
    if (err) { return next(err); }

    if (existingPost){
      const comment = new Comment({
        text,
        _creator,
        _post
      });

      comment.save((err) => {
        if (err) { return next(err); }
        return res.send(comment);
      });
    }
    else res.send({ error: 'Post does not exist' });
  });
}

commentController.deleteComment = (req, res, next) => {
  const userId = req.user._id;
  const commentId = req.body.id;
  console.log(commentId);

  Comment.findById(commentId, (err, comment) => {
    console.log(comment);
    if(comment._creator.toString() !== userId.toString()) {
      return res.status(422).send({ error: 'You do not own this post' });
    }
    Comment.findByIdAndRemove(commentId, (err, comment) => {
      if(err) { return next(err); }

      return res.send(comment);
    });
  });


}

export default commentController;
