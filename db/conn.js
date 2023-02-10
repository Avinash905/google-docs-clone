import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();
mongoose.set("strictQuery", false);

const mongoconn = mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("Db connection established");
  })
  .catch((err) => {
    console.log(err);
  });

export default mongoconn;
