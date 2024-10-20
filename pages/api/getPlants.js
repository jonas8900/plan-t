import dbConnect from "../../db/connect";
import Plant from "../../db/models/Plant";



export default async function handler(request, response) {
    await dbConnect();

	if (request.method === "GET") {
		try {
			const plant = await Plant.find();
			response.status(200).json(plant);
		} catch (error) {
			console.error(error);
			response.status(400).json({ error: error.message });
		}
	}
}