import express from 'express';
import cors from 'cors';
import * as mongoose from 'mongoose';
import config from './config';
import usersRouter from './routers/users';
import expressWs from 'express-ws';
import {WebSocket} from 'ws';
import User from './Models/User';
import Message from './Models/Message';


const app = express();
expressWs(app);

const port = 8000;

app.use(express.json());
app.use(cors());

app.use('/users', usersRouter);

const router = express.Router();

let connectedClients: WebSocket[] = [];
router.ws('/chat', (ws, req) => {
  console.log('client connected,total clients', connectedClients.length);

  let username = 'Anonymous';

  ws.on('message', async (message) => {
    try {
      const decodedMessage = JSON.parse(message.toString());
      if (decodedMessage.type === 'LOGIN') {
        const token = decodedMessage.payload;
        const user = await User.findOne({token});
        if (!user) {
          return ws.send(JSON.stringify({error: 'Invalid token'}));
        }
        username = user.username;
        connectedClients.push(ws);
        const lastMessages = await Message.find().sort({_id: -1}).limit(30).populate('author');
        lastMessages.reverse();
        ws.send(JSON.stringify({type: 'LOAD_MESSAGES', payload: lastMessages}));
      } else if (decodedMessage.type === 'SEND_MESSAGE') {
        const user = await User.findOne({username});
        if (!user) {
          return ws.send(JSON.stringify({error: 'User not found'}));
        }
        const Author = user._id;
        const newMessage = new Message({
          author: Author,
          message: decodedMessage.payload,
        });
        await newMessage.save();
        connectedClients.forEach(client => {
          client.send(JSON.stringify({
            type: 'NEW_MESSAGE',
            payload: {username, message: decodedMessage.payload},
          }));
        });
      }
    } catch (error) {
      ws.send(JSON.stringify({error: 'Invalid Message'}));
    }
  });

  ws.on('close', () => {
    console.log('client disconnected');
    const index = connectedClients.indexOf(ws);
    if (index !== -1) {
      connectedClients.splice(index, 1);
    }
  });
});

app.use(router);


const run = async () => {
  await mongoose.connect(config.database);

  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
  process.on('exit', () => {
    mongoose.disconnect();
  });
};

run().catch(err => {
  console.log(err);
});