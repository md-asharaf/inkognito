import mongoose from "mongoose";
import { logger } from "@/lib/logger";

type ConnectionObject = {
  isConnected?: number;
};

const globalForMongoose = globalThis as unknown as { _mongooseConnection?: ConnectionObject };
const connection: ConnectionObject = globalForMongoose._mongooseConnection || { isConnected: 0 };
if (process.env.NODE_ENV !== "production") globalForMongoose._mongooseConnection = connection;

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    logger.debug("Using existing connection");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    connection.isConnected = db.connections[0].readyState;
    logger.info("Connected to MongoDB successfully");
  } catch (error: any) {
    logger.error({ error }, "Error connecting to MongoDB");
    throw new Error("Failed to connect to database");
  }
}

export default dbConnect;
