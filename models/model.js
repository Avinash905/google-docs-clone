import mongoose from "mongoose";

const schema = mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
});

const Document = mongoose.model("Document", schema);

export default Document;
