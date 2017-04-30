import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const followersSchema = new Schema({
  _user: { type: Schema.ObjectId, ref: 'User' },
  followers: [{ type: Schema.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false }
});

followersSchema.index({ _user: 1 });

const Followers = mongoose.model('Followers', followersSchema);

export default Followers;
