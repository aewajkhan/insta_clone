// backend/models/Post.js
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    description: { type: String, default: "" },
    photoUrl: { type: String, required: true },
    likes: { type: Number, default: 0 },
    comments: [{ type: String }],
  },
  { timestamps: true ,
    versionKey:false
  }
);

module.exports = mongoose.model("Post", postSchema);
