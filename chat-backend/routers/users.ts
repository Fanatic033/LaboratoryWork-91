import express from 'express';
import User from '../Models/User';
import {Error} from 'mongoose';
import {auth, RequestWithUser} from '../middleware/auth';


const usersRouter = express.Router();

usersRouter.use(express.json());

usersRouter.post('/', async (req, res, next) => {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
      displayName: req.body.displayName,
    });
    user.generateToken();
    await user.save();
    return res.send(user);
  } catch (error) {
    if (error instanceof Error.ValidationError) {
      return res.status(400).send(error);
    }
    return next(error);
  }
});

usersRouter.post('/sessions', async (req, res, next) => {
  try {
    const user = await User.findOne({username: req.body.username});
    if (!user) {
      return res.status(400).send({error: 'User not found'});
    }
    const isMatch = await user.checkPassword(req.body.password);
    if (!isMatch) {
      return res.status(400).send({error: 'wrong password'});
    }

    user.generateToken();
    await user.save();

    res.send(user);
  } catch (e) {
    return next(e);
  }
});

usersRouter.delete('/sessions', auth, async (req: RequestWithUser, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).send({error: 'User not found'});
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

export default usersRouter;