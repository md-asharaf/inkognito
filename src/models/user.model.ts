import { Schema, Document, model, models, Model } from "mongoose";

export interface IUser extends Document {
  name?: string;
  image?: string;
  emailVerified?: boolean;
  username: string;
  email: string;
  password?: string;
  verifyCode?: string;
  verifyCodeExpires?: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: Schema.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String },
    image: { type: String },
    emailVerified: { type: Boolean },
    username: {
      type: String,
      required: [true, "Please fill a valid username"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please fill a valid email address"],
      unique: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
    },
    verifyCode: {
      type: String,
    },
    verifyCodeExpires: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAcceptingMessages: {
      type: Boolean,
      default: true,
    },
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  },
);

export default (models?.User as Model<IUser>) ||
  model<IUser>("User", UserSchema, "users");
