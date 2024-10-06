import mongoose from 'mongoose';


const schema = mongoose.Schema;

const MessageSchema = new schema({
  author: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  message: String,
});

const Message = mongoose.model('Message', MessageSchema);

export default Message;