import dbConnect from "../../db/connect";
import Plant from "../../db/models/Plant";

export default async function handler(request, response) {
    await dbConnect();

    const { id } = request.query; 

    if (request.method === "GET") {
        try {
            const plant = await Plant.findById(id); 
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
