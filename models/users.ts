import { Schema, model, Document, CallbackError, Types } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  organization: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  verified: boolean;
  token: string;
  resetPasswordExpires: Date;
  otp : string;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
  firstName: {
    type: String,
    required: [true, "Your firstName is required"],
  },
  lastName: {
    type: String,
    required: [true, "Your lastName is required"],
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
  verified: {
    type: Boolean,
    default: false, // Default value is false
  },
  token: String, // Field to store the reset token
  resetPasswordExpires: Date, // Field to store the token expiration time
  otp: String
});

// Pre-save hook to hash the password
userSchema.pre<IUser>(
  "save",
  async function (next: (err?: CallbackError) => void) {
    // Hash the password only if it has been modified (or is new)
    if (!this.isModified("password")) {
      return next();
    }
    try {
      const hashedPassword = await bcrypt.hash(this.password, 12);
      this.password = hashedPassword;
      next();
    } catch (error) {
      return next(error as CallbackError);
    }
  }
);

const User = model<IUser>(
  process.env.USERS_COLLECTION_NAME || "users",
  userSchema
);

export default User;
