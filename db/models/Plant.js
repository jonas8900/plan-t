import dotenv from 'dotenv'
dotenv.config({ path: '../../.env.local' })
import mongoose from "mongoose";

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
  alarmTime: { type: Date, required: false },
  alarmID: { type: String, required: false },
  isPlantWatered: { type: Boolean, required: false },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  alarmActive: { type: Boolean, default: false },
  nextAlarmTime: { type: Date, required: false },
  lastAlarmSentAt: { type: Date, required: false },
  isPlantWatered: { type: Boolean, default: true },
});



plantSchema.index({ alarmActive: 1, alarmTime: 1 });

const connection = mongoose.createConnection(process.env.MONGODB_URI, { dbName: "plantsDatabase" });
const Plant = connection.model("Plant", plantSchema); 



	
export default Plant;
