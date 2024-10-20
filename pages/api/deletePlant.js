import dbConnect from "@/db/connect";
import Plant from "@/db/models/Plant";

export default async function handler(request, response) {
    await dbConnect();
    const { id } = request.query;

    if(request.method === "DELETE") {
        try {
            await Plant.findByIdAndDelete(id);
            response.status(200).json({ success: true });
        } catch (error) {
            console.error(error);
            response.status(400).json({ error: error.message });
        }
    }
}