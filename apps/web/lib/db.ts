import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable");
}

interface GlobalWithMongoose {
    mongoose: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
}

declare const global: GlobalWithMongoose & typeof globalThis;

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {conn: null, promise: null};
}

export async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URI, {
                bufferCommands: false,
            })
            .then((mongooseInstance) => mongooseInstance);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
