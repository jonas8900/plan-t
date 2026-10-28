import dbConnect from "@/db/connect";
import Plant from "@/db/models/Plant";
import User from "@/db/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { v4 as uuidv4 } from "uuid";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Methode nicht erlaubt" });
  }

  await dbConnect();

  const session = await getServerSession(request, response, authOptions);
  if (!session?.user?.id) {
    return response.status(401).json({ error: "Nicht authentifiziert" });
  }

  const { plantId, alarmTime, alarmActive = true } = request.body || {};
  const parsedAlarmTime = new Date(alarmTime);

  if (!plantId || !alarmTime || Number.isNaN(parsedAlarmTime.getTime())) {
    return response.status(400).json({ error: "Ungültige Alarmdaten" });
  }

  try {
    const plant = await Plant.findOne({
      _id: plantId,
      userId: session.user.id,
    });

    if (!plant) {
      return response.status(404).json({ error: "Pflanze nicht gefunden" });
    }

    if (!plant.userSubscription) {
      const user = await User.findById(session.user.id).select("userSubscription");
      if (user?.userSubscription) {
        plant.userSubscription = user.userSubscription;
      }
    }

    plant.alarmTime = parsedAlarmTime;
    plant.nextAlarmTime = parsedAlarmTime;
    plant.alarmActive = Boolean(alarmActive);
    plant.alarmID = plant.alarmID || uuidv4();
    plant.lastAlarmSentAt = null;

    await plant.save();

    return response.status(200).json({ message: "Alarm gespeichert", plant });
  } catch (error) {
    return response.status(400).json({ error: "Fehler beim Speichern des Alarms" });
  }
}
