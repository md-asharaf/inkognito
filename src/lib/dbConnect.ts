import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const globalForMongoose = globalThis as unknown as { _mongooseConnection?: ConnectionObject };
const connection: ConnectionObject = globalForMongoose._mongooseConnection || {};
if (process.env.NODE_ENV !== "production") globalForMongoose._mongooseConnection = connection;

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Using existing connection");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    connection.isConnected = db.connections[0].readyState;
    console.log("Connected to MongoDB successfully");
  } catch (error: any) {
    console.log("Error connecting to MongoDB", error.message);
    throw new Error("Failed to connect to database");
  }
}

export default dbConnect;
