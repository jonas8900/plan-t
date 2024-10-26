import { getSession } from "next-auth/react";
import dbConnect from "../../db/connect";
import Plant from "../../db/models/Plant";

export default async function handler(request, response) {
    await dbConnect();

    const { id } = request.query; 

    const session = await getSession({ req: request });

    if (!session) {
        return response.status(401).json({ error: "Not authenticated" });
    }

    const userId = session.user.id;

    if (request.method === "GET") {
        try {
            const plants = await Plant.find({ userId: userId });
            const plant = plants.find((plant) => plant._id.toString() === id);
            
            if (!plant) {
                return response.status(404).json({ error: "Plant not found" });
            }
            response.status(200).json(plant); 
        } catch (error) {
            console.error(error);
            response.status(400).json({ error: error.message });
        }
    } else {
        response.status(405).json({ error: "Method not allowed" });
    }
}
