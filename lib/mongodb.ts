import mongoose from "mongoose";

export const connect = async () => {
  try {
    if (mongoose.connections[0].readyState) return;
    await mongoose.connect(process.env.MONGODB_URI as string, {
      dbName: "ChatApplication",
    });
  } catch (error) {
    console.log((error as Error).message);
  }
};

export const disconnect = async () => {
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.log((error as Error).message);
  }
};
