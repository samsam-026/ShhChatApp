const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

chatSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Chat', chatSchema);