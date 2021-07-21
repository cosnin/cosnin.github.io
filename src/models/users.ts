import { Document, Schema, Model, model, Mongoose } from "mongoose";
import bcrypt from "bcryptjs";

const saltRounds = 13;

export interface IUser {
  name: string;
  userId: string;
  password: string;
  createdAt?: Date;
}

export interface IUserModel extends IUser, Document {}

export const UserSchema: Schema = new Schema(
  {
    name: String,
    userId: {
      type: String,
      lowercase: true,
      index: true,
      required: true,
      unique: true
    },
    password: String,
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    usePushEach: true,
    bufferCommands: false,
    versionKey: false
  }
);

UserSchema.set("toObject", { virtuals: true });
UserSchema.set("toJSON", { virtuals: true });

export const UserModel: Model<IUserModel> = model<IUserModel>(
  "users",
  UserSchema
);

// Return a salted password the say way that is done for the database.
export var createSaltedPassword = function (
  password: string,
  callback: Function
) {
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(password, salt, function (err1, hash) {
      callback(err1, hash);
    });
  });
};

export var compareSaltedPassword = function (
  password: string,
  hash: string,
  callback: Function
) {
  bcrypt.compare(password, hash, function (err, isMatch) {
    callback(err, isMatch);
  });
};

export var findByUserId = function (userId: string, cb: Function) {
  UserModel.findOne({ userId }, function (err, User) {
    cb(err, User);
  });
};

export var findById = function (id: Schema.Types.ObjectId, cb: Function) {
  UserModel.findById(id).exec(function (err, User) {
    cb(err, User);
  });
};

export var findMultipleByIds = function (
  UserIds: [Schema.Types.ObjectId],
  cb: Function
) {
  UserModel.find({ _id: { $in: UserIds } }, function (err, UserList) {
    cb(err, UserList);
  });
};

export var getAllUsers = function (cb: Function) {
  UserModel.find({}, { password: 0 }, {}, function (err, UserList) {
    cb(err, UserList);
  });
};

export var queryUsers = function (
  query,
  projection: any,
  options: any,
  cb: Function
) {
  UserModel.find(query, projection, options, function (err, UserList) {
    cb(err, UserList);
  });
};

export var queryUserIds = function (query, cb: Function) {
  UserModel.distinct("_id", query, function (err, UserList) {
    cb(err, UserList);
  });
};

export var createUser = function (UserObj: any, cb: Function) {
  UserModel.insertMany([UserObj], {}, function (err, User) {
    cb(err, User);
  });
};

export var updateUserById = function (UserId: any, UserObj: any, cb: Function) {
  UserModel.updateOne(
    { userId: UserId },
    { $set: UserObj },
    { upsert: false },
    function (err, User) {
      cb(err, User);
    }
  );
};

export var deleteUsers = (UserId: Schema.Types.ObjectId, cb: Function) => {
  UserModel.deleteMany({ _id: { $in: UserId } }, {}, (err: any) => {
    cb(err);
  });
};

export var deleteUserPermanent = (
  UserId: Schema.Types.ObjectId,
  cb: Function
) => {
  UserModel.deleteOne({ _id: UserId }, {}, (err: any) => {
    cb(err);
  });
};
