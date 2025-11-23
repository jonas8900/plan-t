import dbConnect from "@/db/connect";
import Plant from "@/db/models/Plant";
import { getServerSession } from "next-auth";
import { v4 as uuidv4 } from "uuid";




export default async function hander(request, response) {
    await dbConnect();

     const session = await getServerSession(request, response);


    if(!session) {
        return response.status(401).json({error: "Unauthorized" });
    }


    if(request.method === "POST") {
        try {
            const { plantId, alarmTime, alarmActive } = request.body;
            const plant = await Plant.findById(plantId);
            plant.alarmTime = alarmTime;
            plant.alarmActive = alarmActive;
            plant.alarmID = uuidv4();
            await plant.save();
            console.log(plant);
            response.status(200).json({ message: "Alarm added" });
        } catch (error) {
            response.status(400).json({ error: "Error adding alarm" });
        }
    }
    
}