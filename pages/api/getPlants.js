import dbConnect from "../../db/connect";
import Plant from "../../db/models/Plant";
import { getSession } from "next-auth/react";

export default async function handler(request, response) {
    await dbConnect();

    const session = await getSession({ req: request });

    if (!session) {
        return response.status(401).json({ error: "Nicht authentifiziert" });
    }

    const userId = session.user.id; 

    if (request.method === "GET") {
        try {
            const plants = await Plant.find({ userId: userId });
            response.status(200).json(plants);
        } catch (error) {
            console.error(error);
            response.status(400).json({ error: error.message });
        }
    } else {
        response.status(405).json({ error: "Methode nicht erlaubt" });
    }
}
