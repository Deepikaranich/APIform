const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
const bcryptSalt = process.env.BCRYPT_SALT;
const userSchema = new Schema(
  {
    // name: {
    //   type: String,
    //   trim: true,
    //   required: true,
    //   unique: true,
    // },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    password: { type: String },
  },
  {
    timestamps: true,
  }
);
module.exports = User = mongoose.model('User', userSchema)