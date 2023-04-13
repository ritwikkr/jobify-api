import mongoose from "mongoose";

function connectDB(uri) {
  try {
    return mongoose.connect(uri);
  } catch (error) {
    console.log(`MongoDB:${error}`);
  }
}

export default connectDB;
