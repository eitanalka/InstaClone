import express from 'express';
import multer from 'multer';
import bodyParser from 'body-parser';
import passportService from './services/passport';
import passport from 'passport';

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', {session: false });

// Controller Imports
import userController from './controllers/userController';
import postController from './controllers/postController';
import commentController from './controllers/commentController';
import followingController from './controllers/followingController';
import followersController from './controllers/followersController';
import likesController from './controllers/likesController';

const routes = express();
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('image');
const jsonParser = bodyParser.json({ type: '*/*', limit: '50mb'});

// User Routes
routes.post('/signup', jsonParser, userController.signup); // signup user
routes.post('/signin', jsonParser, requireSignin, userController.signin); // signin user
routes.post('/uploadprofilepic', upload, requireAuth, userController.uploadProfilePic); // upload user profile pic
routes.delete('/deleteuser', jsonParser, requireAuth, userController.deleteUser); // delete user

// Post routes
routes.post('/createpost', upload, requireAuth, postController.createPost);
routes.get('/getpublicpost/:id', jsonParser, postController.getPublicPost);
routes.get('/getpublicposts', jsonParser, postController.getPublicPosts);
routes.get('/getfollowingposts', jsonParser, requireAuth, postController.getFollowingPosts);
routes.get('/getpost/:id', jsonParser, requireAuth, postController.getPost);
routes.delete('/deletepost/:id', jsonParser, requireAuth, postController.deletePost);

// Comment routes
routes.post('/createcomment', jsonParser, requireAuth, commentController.createComment);
routes.delete('/deletecomment', jsonParser, requireAuth, commentController.deleteComment);

// Following routes
routes.post('/follow', jsonParser, requireAuth, followingController.follow);
routes.get('/getfollowing', jsonParser, requireAuth, followingController.getFollowing);
routes.delete('/unfollow', jsonParser, requireAuth, followingController.unfollow);

// Followers routes
routes.get('/getfollowers', jsonParser, requireAuth, followersController.getFollowers);

// Likes routes
routes.post('/like', jsonParser, requireAuth, likesController.like);
routes.post('/unlike', jsonParser, requireAuth, likesController.unlike);
routes.post('/likeorunlike', jsonParser, requireAuth, likesController.likeOrUnlike);

export default routes;
