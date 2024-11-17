import dbConnect from "../../db/connect";
import Plant from "../../db/models/Plant";


export default async function handler(request, response) {
	await dbConnect();

	console.log(request.body);

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