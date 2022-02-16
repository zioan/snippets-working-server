const mongoose = require("mongoose");

const snippetTagSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    user: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

snippetTagSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

snippetTagSchema.set("toJSON", {
  virtuals: true,
});

exports.SnippetTag = mongoose.model("SnippetTag", snippetTagSchema);
