import dbConnect from "@/db/connect";
import Plant from "@/db/models/plant";

export default async function handler(request, response) {
	await dbConnect();

	if (request.method === "POST") {
		try {
			await Plant.create(request.body);
			response.status(200).json({ status: "Plant successfully created." });
		} catch (error) {
			console.error(error);
			response.status(400).json({ error: error.message });
		}
	}
}

