import dotenv from 'dotenv'
dotenv.config({ path: '../../.env.local' })

import mongoose from "mongoose";


const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_NAME = process.env.DATABASE_NAME;



if (!MONGODB_URI) {
  throw new Error("Bitte definiere die MONGODB_URI-Umgebungsvariable in .env.local");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  console.log('dbConnect called');
  if (cached.conn) {
    console.log('Reusing existing connection');
    return cached.conn;
  }


  if (!cached.promise) {
    const opts = {
      dbName: MONGODB_NAME,
      bufferCommands: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('New connection established');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise; 
  } catch (e) {
    cached.promise = null; 
    throw e; 
  }

  return cached.conn; 
}

export default dbConnect;
