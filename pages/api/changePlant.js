import dbConnect from "../../db/connect";
import Plant from "../../db/models/Plant";
import { calculateSuggestedAlarmDate } from "@/utils";

export default async function handler(request, response) {
  await dbConnect();

  const { method, body, query } = request;
  const { id } = query;

  if (method !== "PUT") {
    return response.status(405).json({ error: `Method ${method} Not Allowed` });
  }

  if (!id) {
    return response.status(400).json({ error: "Plant ID is required" });
  }

  const requiredFields = [
    "plantname",
    "planttype",
    "lastwatering",
    "wateringinterval",
    "repotting",
  ];
  const missingFields = requiredFields.filter((field) => !body[field]);

  if (missingFields.length > 0) {
    return response
      .status(400)
      .json({ error: `Missing fields: ${missingFields.join(", ")}` });
  }

  try {
    const plant = await Plant.findById(id);
    if (!plant) {
      return response.status(404).json({ error: "Plant not found" });
    }

    const wateringChanged =
      String(plant.lastwatering) !== String(new Date(body.lastwatering)) ||
      Number(plant.wateringinterval) !== Number(body.wateringinterval);

    Object.assign(plant, body);

    if (wateringChanged && plant.alarmTime) {
      const updatedAlarmTime = calculateSuggestedAlarmDate(plant);
      plant.alarmTime = updatedAlarmTime;
      plant.nextAlarmTime = updatedAlarmTime;
      plant.lastAlarmSentAt = null;
    }

    await plant.save();
    return response.status(200).json(plant);
  } catch (error) {
    return response.status(500).json({ error: "Internal Server Error" });
  }
}
