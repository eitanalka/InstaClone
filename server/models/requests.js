import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const requestsSchema = new Schema({
  _user: { type: Schema.ObjectId, ref: 'User' },
  requests: [{ type: Schema.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  isDeleted: { type; Boolean, default: false }
});

requestsSchema.index({ _user: 1 });

const Requests = mongoose.model('Requests', requestsSchema);

export default Requests;
