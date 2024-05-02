const mongoose = require("mongoose");
const { Schema } = mongoose;

const PostSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true, maxlength: 100 },
    category: {
      type: String,
      enum: ["Development", "Design", "Innovation", "Tutorial", "Bussiness"],
      required: true,
    },
    content: { type: String, required: true },
    media: [String],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        user_id: { type: Schema.Types.ObjectId, ref: "User" },
        comment: { type: String, required: true },
        created_at: { type: Date, default: Date.now },
      },
    ],
    created_at: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

const PostModel = mongoose.model("Post", PostSchema);

module.exports = {
  PostModel,
};
