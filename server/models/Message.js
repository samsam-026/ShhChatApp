const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  chatId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
},
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  });

messageSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Message', messageSchema);
