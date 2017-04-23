import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const postSchema = new Schema({
  image: { type: String, required: true },
  caption: { type: String, default: '' },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  _creator: { type: Schema.ObjectId, ref: 'User'}
});

postSchema.index({ _creator: 1, createdAt: 1 });

const Post = mongoose.model('Post', postSchema);

export default Post;
