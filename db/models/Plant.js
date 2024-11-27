import mongoose from "mongoose";
import { use } from "react";

const { Schema } = mongoose;

const plantSchema = new Schema({
  plantname: { type: String, required: true },
  plantprocurement: { type: String, required: false }, 
  planttype: { type: String, required: true },
  file: { type: String, required: false },
  purchaseprice: { type: Number, required: false }, 
  repotting: { type: Date, required: true },
  size: { type: Number, required: false }, 
  wateringinterval: { type: Number, required: true }, 
  lastwatering: { type: Date, required: true },
  description: { type: String, required: false },
  userId: { type: String, required: true, index: true },
  alarmTime: { type: String, required: false },
  alarmActive: { type: Boolean, required: false },
  userSubscription: { type: Object, required: false },
});

const connection = mongoose.createConnection(process.env.MONGODB_URI, { dbName: "plantsDatabase" });
const Plant = connection.model("Plant", plantSchema); 
	
export default Plant;
