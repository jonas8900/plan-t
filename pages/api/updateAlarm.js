import dbConnect from "@/db/connect";
import Plant from "@/db/models/Plant";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { calculateNextRecurringAlarm } from "@/utils";

export default async function handler(request, response) {
  if (request.method !== "PUT") {
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
    const plant = await Plant.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!plant) {
      return response.status(404).json({ error: "Pflanze nicht gefunden" });
    }

    plant.alarmActive = !plant.alarmActive;

    if (plant.alarmActive && plant.alarmTime) {
      const now = new Date();
      if (plant.alarmTime <= now) {
        const nextDate = calculateNextRecurringAlarm(
          plant.alarmTime,
          plant.wateringinterval,
          now
        );
        plant.alarmTime = nextDate;
        plant.nextAlarmTime = nextDate;
      }
      plant.lastAlarmSentAt = null;
    }

    await plant.save();

    return response.status(200).json({ message: "Alarm aktualisiert", plant });
  } catch (error) {
    return response.status(400).json({ error: "Fehler beim Aktualisieren des Alarms" });
  }
}
