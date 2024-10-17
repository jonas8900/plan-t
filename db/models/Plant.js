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
});

const connection = mongoose.createConnection(process.env.MONGODB_URI, { dbName: "plantsDatabase" });
const Plant = connection.model("Plant", plantSchema); 
	
export default Plant;
