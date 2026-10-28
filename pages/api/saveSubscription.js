import dbConnect from "@/db/connect";
import Plant from "@/db/models/Plant";
import User from "@/db/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Methode nicht erlaubt." });
  }

  await dbConnect();

  const session = await getServerSession(request, response, authOptions);
  if (!session?.user?.id) {
    return response.status(401).json({ error: "Nicht authentifiziert." });
  }

  const { plantId, subscription } = request.body || {};
  if (!subscription?.endpoint) {
    return response.status(400).json({ error: "Ungültige Push-Subscription." });
  }

  try {
    await User.findByIdAndUpdate(session.user.id, {
      userSubscription: subscription,
    });

    if (plantId) {
      const plant = await Plant.findOne({
        _id: plantId,
        userId: session.user.id,
      });

      if (!plant) {
        return response.status(404).json({ error: "Pflanze nicht gefunden." });
      }

      plant.userSubscription = subscription;
      await plant.save();
    }

    await Plant.updateMany(
      { userId: session.user.id },
      { $set: { userSubscription: subscription } }
    );

    return response.status(200).json({
      success: true,
      message: "Subscription gespeichert!",
    });
  } catch (error) {
    return response.status(500).json({
      error: "Fehler beim Speichern der Subscription.",
    });
  }
}
