import dbConnect from "@/db/connect";
import Plant from "@/db/models/Plant";

export default async function handler(request, response) {
    await dbConnect();
    const { id } = request.body;

    if (request.method === "DELETE") {
        try {
            const plant = await Plant.findByIdAndUpdate(
                id,
                { $unset: { alarmActive: "", alarmTime: "" } }, 
                { new: true } 
            );

            if (!plant) {
                return response.status(404).json({ message: "Plant not found" });
            }

            response.status(200).json({ message: "Fields removed", plant });

        } catch (error) {
            console.error(error);
            response.status(400).json({ error: error.message });
        }
    } else {
        response.status(405).json({ message: "Method not allowed" });
    }
}

