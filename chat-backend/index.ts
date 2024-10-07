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

let connectedClients: { ws: WebSocket, displayName: string }[] = [];

router.ws('/chat', (ws, req) => {
  let displayName = 'Anonymous';

  const onlineUsers = () => {
    const displayNames = connectedClients.map(client => client.displayName);
    connectedClients.forEach(client => {
      client.ws.send(JSON.stringify({
        type: 'ONLINE_USERS',
        payload: displayNames,
      }));
    });
  };

  ws.on('message', async (message) => {
    try {
      const decodedMessage = JSON.parse(message.toString());
      if (decodedMessage.type === 'LOGIN') {
        const token = decodedMessage.payload;
        const user = await User.findOne({token});
        if (!user) {
          return ws.send(JSON.stringify({error: 'Invalid token'}));
        }
        displayName = user.displayName;
        connectedClients.push({ws, displayName});
        const lastMessages = await Message.find().sort({_id: -1}).limit(30).populate('author', '_id displayName username');
        lastMessages.reverse();
        ws.send(JSON.stringify({type: 'LOAD_MESSAGES', payload: lastMessages}));
        onlineUsers();
      } else if (decodedMessage.type === 'SEND_MESSAGE') {
        const user = await User.findOne({displayName});
        if (!user) {
          return ws.send(JSON.stringify({error: 'User not found'}));
        }
        const newMessage = new Message({
          author: {
            _id: user._id,
            displayName: user.displayName,
          },
          message: decodedMessage.payload,
        });
        await newMessage.save();
        connectedClients.forEach(client => {
          client.ws.send(JSON.stringify({
            type: 'NEW_MESSAGE',
            payload: {
              author: {
                _id: user._id,
                displayName: user.displayName
              },
              message: decodedMessage.payload
            }
          }));
        });
      }
    } catch (error) {
      ws.send(JSON.stringify({error: 'Invalid Message'}));
    }
  });

  ws.on('close', () => {
    console.log('client disconnected');
    const index = connectedClients.findIndex(client => client.ws === ws);
    if (index !== -1) {
      connectedClients.splice(index, 1);
      onlineUsers();
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
