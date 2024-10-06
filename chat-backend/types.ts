import {Model} from 'mongoose';

export interface UserFields {
  username: string;
  password: string;
  token: string;
  role: string;
  displayName: string;
}

export interface UserMethods {
  checkPassword(password: string): Promise<Boolean>;

  generateToken(): void;
}

export type UserModel = Model<UserFields, {}, UserMethods>