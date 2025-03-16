import dbConnect from "@/db/connect";
import Plant from "@/db/models/Plant";
import { getSession } from "next-auth/react";


export default async function hander(request, response) {
    await dbConnect();

    // const session = await getSession({ req: request });


    if(request.method === "PUT") {
        try {
            const { id } = request.body;
            const plant = await Plant.findById(id);
            if(plant.alarmActive === true) {
                plant.alarmActive = false;
            } else {
                plant.alarmActive = true;

            }
            await plant.save();
            console.log(plant);
            response.status(200).json({ message: "Alarm updated", plant });
        } catch (error) {
            response.status(400).json({ error: "Error adding alarm" });
        }
    }
}