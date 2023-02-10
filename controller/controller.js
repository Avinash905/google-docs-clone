import Document from "../models/model.js";

export const getDocument = async (id) => {
  const data = await Document.findById({ _id: id });
  if (data) return data;
  return await Document.create({ _id: id, data: "" });
};

export const updateDocument = async (id, data) => {
  return await Document.findByIdAndUpdate(id, { data });
};
