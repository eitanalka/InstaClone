import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const followersSchema = new Schema({
  _user: { type: Schema.ObjectId, ref: 'User' },
  followers: [{ type: Schema.ObjectId, ref: 'User'}]
});

const Followers = mongoose.model('Followers', followersSchema);

export default Followers;
