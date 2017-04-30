import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const followingSchema = new Schema({
  _user: { type: Schema.ObjectId, ref: 'User' },
  following: [{ type: Schema.ObjectId, ref: 'User'}],
  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false }
});

followingSchema.index({ _user: 1 });

const Following = mongoose.model('Following', followingSchema);

export default Following;
