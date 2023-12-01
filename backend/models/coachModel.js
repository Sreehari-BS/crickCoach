import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const coachSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function (value) {
          return /^\d{10}$/.test(value);
        },
        message: "Please enter a valid 10 digit phone number",
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return value.length >= 6;
        },
        message: "Password must be at least 6 characters long",
      },
    },
    age: {
      type: Number,
    },
    experience: {
      type: Number,
    },
    profileImage: {
      type: String,
    },
    certificates: [
      {
        type: String,
      },
    ],
    videos: [{
      title:{
        type: String,
      },
      video: {
        type: String,
      }
    }],
    is_verified: {
      type: Boolean,
      default: false,
    },
    is_blocked: {
      type: Boolean,
      default: false,
    },
    is_approved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

coachSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

coachSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Coach = mongoose.model("Coach", coachSchema);

export default Coach;
