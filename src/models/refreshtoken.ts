import { Document, Schema, Model, model } from "mongoose";

export const TOKEN_EXPIRY: number = 60 * 24 * 30; //30 days In Minutes

export enum UserType {
  ADMIN = "ADMIN",
  USER = "USER"
}

export interface IRefreshToken {
  token: string;
  userType: string;
  userId: Schema.Types.ObjectId;
  createdAt?: Date;
}

export interface IRefreshTokenModel extends IRefreshToken, Document {}

var RefreshTokenSchema: Schema = new Schema(
  {
    token: {
      type: String,
      index: true,
      unique: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      index: true
    },
    userType: {
      type: String,
      enum: [UserType.ADMIN, UserType.USER],
      default: UserType.USER
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: TOKEN_EXPIRY * 60
    }
  },
  {
    usePushEach: true,
    bufferCommands: false,
    versionKey: false
  }
);

export const RefreshTokenModel: Model<IRefreshTokenModel> = model<IRefreshTokenModel>(
  "refreshtokens",
  RefreshTokenSchema
);

export let updateToken = function (
  token: string,
  userId: string,
  cb: Function
) {
  let tokenObj = new RefreshTokenModel({ token, userId });
  tokenObj.save(function (err, result) {
    cb(err, result);
  });
};

export let findByToken = function (token: string, cb: Function) {
  RefreshTokenModel.findOne({ token }, function (err, result) {
    cb(err, result);
  });
};

export let deleteToken = function (userId: string | any, cb: Function) {
  RefreshTokenModel.deleteOne({ userId }, function (err) {
    cb(err);
  });
};
