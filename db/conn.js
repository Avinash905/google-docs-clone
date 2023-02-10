import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();
mongoose.set("strictQuery", false);

const mongoconn = mongoose
  .connect(process.env.DB_URI)
  .then(() => {})
  .catch((err) => {});

export default mongoconn;
