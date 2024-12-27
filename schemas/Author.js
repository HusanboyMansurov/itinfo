const { Schema, model } = require("mongoose");

const authorSchema = new Schema(
  {
    first_name: {
      type: String,
      trim: true,
      required: true,
    },
    last_name: {
      type: String,
      trim: true,
    },
    full_name: String,
    nick_name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      unique: true,
    },
    info: {
      type: String,
    },
    position: {
      type: String,
    },
    photo: {
      type: String,
    },
    is_expert: {
      type: Boolean,
      default: false,
    },
    is_active: {
      type: Boolean,
      default: false,
    },
    refresh_token: String,
    activation_link: String,
  },
  { versionKey: false }
);

module.exports = model("Author", authorSchema);

// token: {
//       type: String,
//     },
//     activation_link: {
//       type: String,
//     },
