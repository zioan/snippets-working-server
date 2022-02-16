const mongoose = require("mongoose");
// const Array = mongoose.Schema.Types.Array;
const ObjectId = mongoose.Schema.Types.ObjectId;

const snippetSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    code: { type: String, required: true },
    tag: { type: String, default: "no tag" },
    user: { type: ObjectId, required: true },
  },
  {
    timestamps: true,
  }
);

//add a new field "id" from "_id" with the same value

snippetSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

snippetSchema.set("toJSON", {
  virtuals: true,
});

exports.Snippet = mongoose.model("Snippet", snippetSchema);
