import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const followingSchema = new Schema({
  _user: { type: Schema.ObjectId, ref: 'User' },
  following: [{ type: Schema.ObjectId, ref: 'User'}]
});

const Following = mongoose.model('Following', followingSchema);

export default Following;
