import dbConnect from "../../db/connect";
import Plant from "../../db/models/Plant";

export default async function handler(request, response) {
    await dbConnect();

    const { method, body, query } = request;
    const { id } = query;

    switch (method) {
        case "PUT":
            if (!id) {
                return response.status(400).json({ error: "Plant ID is required" });
            }

            const requiredFields = ["plantname", "planttype", "lastwatering", "wateringinterval", "repotting"];
            const missingFields = requiredFields.filter(field => !body[field]);

            if (missingFields.length > 0) {
                return response.status(400).json({ error: `Missing fields: ${missingFields.join(", ")}` });
            }

            try {
                const updatedPlant = await Plant.findByIdAndUpdate(id, body, { new: true });

                if (!updatedPlant) {
                    return response.status(404).json({ error: "Plant not found" });
                }

                return response.status(200).json(updatedPlant);
            } catch (error) {
                console.error(error);
                return response.status(500).json({ error: "Internal Server Error" });
            }

        default:
            return response.status(405).json({ error: `Method ${method} Not Allowed` });
    }
}
