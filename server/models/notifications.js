import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const notificationsSchema = new Schema({
  _user: { type: Schema.ObjectId, ref: 'User' },
  requests: [{ type: Schema.ObjectId, ref: 'User' }],
  comments: [{ type: Schema.ObjectId, ref: 'User' }],
  likes: [{ type: Schema.ObjectId, ref: 'User' }],
  following: [{ type: Schema.ObjectId, ref: 'User'}]
});

notificationsSchema.index({ _user: 1 });

const Notifications = mongoose.model('Notifications', notificationsSchema);

export default Notifications;
