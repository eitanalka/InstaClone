import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const likesSchema = new Schema({
  _post: { type: Schema.ObjectId, ref: 'Post' },
  likes: [{ type: Schema.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false }
});

likesSchema.index({ _post: 1, createdAt: 1 });

const Likes = mongoose.model('Likes', likesSchema);

export default Likes;
