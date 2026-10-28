import dbConnect from "@/db/connect";
import Plant from "@/db/models/Plant";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(request, response) {
  if (request.method !== "GET") {
    return response.status(405).json({ error: "Methode nicht erlaubt" });
  }

  await dbConnect();

  const session = await getServerSession(request, response, authOptions);
  if (!session?.user?.id) {
    return response.status(401).json({ error: "Nicht authentifiziert" });
  }

  try {
    const plants = await Plant.find({
      userId: session.user.id,
      alarmTime: { $exists: true, $ne: null },
    }).sort({ alarmTime: 1 });

    return response.status(200).json(plants);
  } catch (error) {
    return response.status(400).json({ error: "Alarme konnten nicht geladen werden" });
  }
}
