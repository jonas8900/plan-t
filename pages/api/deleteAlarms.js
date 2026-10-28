import dbConnect from "@/db/connect";
import Plant from "@/db/models/Plant";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(request, response) {
  if (request.method !== "DELETE") {
    return response.status(405).json({ error: "Methode nicht erlaubt" });
  }

  await dbConnect();

  const session = await getServerSession(request, response, authOptions);
  if (!session?.user?.id) {
    return response.status(401).json({ error: "Nicht authentifiziert" });
  }

  const { id } = request.body || {};
  if (!id) {
    return response.status(400).json({ error: "Pflanzen-ID fehlt" });
  }

  try {
    const plant = await Plant.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      {
        $set: { alarmActive: false },
        $unset: {
          alarmTime: "",
          nextAlarmTime: "",
          alarmID: "",
          lastAlarmSentAt: "",
        },
      },
      { new: true }
    );

    if (!plant) {
      return response.status(404).json({ error: "Pflanze nicht gefunden" });
    }

    return response.status(200).json({ message: "Alarm gelöscht", plant });
  } catch (error) {
    return response.status(400).json({ error: "Fehler beim Löschen des Alarms" });
  }
}
