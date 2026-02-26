import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is missing in .env.local");
}

// Keep cached connection across hot reloads in dev
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache:
    | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
    | undefined;
}

const cached = global.mongooseCache || (global.mongooseCache = { conn: null, promise: null });

export async function connectDB(): Promise<typeof mongoose> {
  try {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
      console.log("🔌 Connecting to MongoDB...");
      cached.promise = mongoose.connect(MONGODB_URI as string).then((m) => m);
    }

    cached.conn = await cached.promise;
    console.log("✅ MongoDB connected");
    return cached.conn;
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    throw err;
  }
}