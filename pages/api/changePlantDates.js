import dbConnect from "../../db/connect";
import Plant from "../../db/models/Plant";
import { calculateSuggestedAlarmDate } from "@/utils";

export default async function handler(request, response) {
  if (request.method !== "PUT") {
    return response.status(405).json({ error: "Methode nicht erlaubt" });
  }

  await dbConnect();
  const { actionselect, dateforchange } = request.body || {};

  try {
    const plant = await Plant.findById(request.query.id);
    if (!plant) {
      return response.status(404).json({ error: "Pflanze nicht gefunden" });
    }

    plant[actionselect] = dateforchange;

    if (actionselect === "lastwatering" && plant.alarmTime) {
      const updatedAlarmTime = calculateSuggestedAlarmDate(plant);
      plant.alarmTime = updatedAlarmTime;
      plant.nextAlarmTime = updatedAlarmTime;
      plant.lastAlarmSentAt = null;
    }

    await plant.save();
    return response.status(200).json(plant);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
}
