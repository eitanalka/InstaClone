import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: { type: String, default: '' },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  _creator: { type: Schema.ObjectId, ref: 'User' },
  _post: { type: Schema.ObjectId, ref: 'Post' }
});

commentSchema.index({ _post: 1, createdAt: 1 });

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
