import Post from '../models/post';
import Comment from '../models/comment';
import Datauri from 'datauri';
import cloudinary from 'cloudinary';
import path from 'path';
import mongoose from 'mongoose';

const dUri = new Datauri();

const postController = {};

mongoose.Promise = global.Promise;

// Query for comments of a single post
function getCommentsQuery(_post){
  var query = Comment.find({_post}, '_id _creator createdAt text').populate({
    path: '_creator',
    select: 'username -_id'
  });

  return query;
}

// Query for comments of an array of posts, recieves an array of post ids
function getCommentsQuery(postIds){
  var query = Comment.find({ '_post': { $in: postIds }}, '_id _creator createdAt text _post').populate({
    path: '_creator',
    select: 'username -_id'
  });

  return query;
}

postController.createPost = (req, res, next) => {
  const image = req.file;
  const caption = req.body.caption;
  const _creator = req.user._id;

  // Validation
  if(!image) {
    return res.status(422).send({ error: 'Please upload an image' });
  }

  const extension = (path.extname(image.originalname).toString());
  console.log(extension !=='.jpg');
  if(extension !== '.jpg' && extension !== '.jpeg' && extension !== '.png'){
    return res.status(422).send({ error: 'Please provide an image of file type .jpg, .jpeg, or .png' });
  }
  dUri.format(extension, image.buffer); // sets file up for cloudinary upload
  cloudinary.uploader.upload(dUri.content, (result) => { // upload to cloudinary
    const post = new Post({
      image: result.url,
      caption,
      _creator
    });

    post.save((err) => {
      if (err) { return next(err); }
      return res.send(post);
    });
  }, { width: 500, height: 500, crop: "limit" }); // image transformations
}

// Requires no authentication
postController.getPublicPost = (req, res, next) => {
  const postId = req.params.id;
  let query = getCommentsQuery(postId);
  Post.findById(postId).lean().populate({
    path: '_creator',
    select: 'username private -_id',
  }).exec((err, post) => {
    if (err) { return next(err); }

    if (post) {
      if(!post._creator.private) {
        query.exec((err, comments) => { // Query for comments of post
          if(err) { return next(err); }
          const existingComments = comments.filter((comment) => { // filters out the deleted comments
            return !comment.isDeleted;
          });
          existingComments.sort((a, b) => { // sorts comments by date from oldest to newest
            return a.createdAt>b.createdAt ? 1 : a.createdAt<b.createdAt ? -1 : 0;
          });
          post.comments = existingComments;
          return res.send(post);
        });
      }
      else return res.send({ error: 'This user is private' });
    }
  });
}

// Requires no authentication
postController.getPublicPosts = (req, res, next) => {
  Post.find({}).lean().populate({
    path: '_creator',
    select: 'username -_id',
    match: { 'private': false }
  }).exec((err, posts) => {
    if (err) { return next(err); }

    if (posts) {
      const publicPosts = posts.filter((post) => {
        return post._creator;
      });
      const publicPostsIds = publicPosts.map((post) => {
        return post._id;
      });
      getCommentsQuery(publicPostsIds).exec((err, comments) => { // Query for comments of all public posts
        if(err) { return next(err); }

        const existingComments = comments.filter((comment) => {
          return !comment.isDeleted;
        });
        publicPosts.forEach((post) => {
          const commentsForPost = existingComments.filter((comment) => {
            return comment._post.toString() === post._id.toString();
          });
          commentsForPost.sort((a, b) => { // sorts comments by date from oldest to newest
            return a.createdAt>b.createdAt ? 1 : a.createdAt<b.createdAt ? -1 : 0;
          });
          post.comments = commentsForPost;
        });
        return res.send(posts);
      });
    }
  });
}

postController.deletePost = (req, res, next) => {
  const userId = req.user._id;
  const postId = req.params.id;

  Post.findById(postId, (err, post) => {
    if(post._creator.toString() === userId.toString()) {
      return res.status(422).send({ error: 'You do not own this post' });
    }
    Post.findByIdAndRemove(postId, (err, post) => {
      if(err) { return next(err); }
      Comment.remove({ _post: postId}, (err) => {
        if(err) { return next(err); }
      })
      return res.send(post);
    });
  });
}

export default postController;
