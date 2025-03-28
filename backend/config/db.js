import mongoose from "mongoose";

const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_DB_URL)
    .then(() => {
      console.log("Database connected");
    })
    .catch((error) => console.error(error));
};

export default dbConnection;
