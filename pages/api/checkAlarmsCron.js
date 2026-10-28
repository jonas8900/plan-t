import dbConnect from "@/db/connect";
import Plant from "@/db/models/Plant";
import User from "@/db/models/User";
import webPush from "web-push";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { calculateNextRecurringAlarm } from "@/utils";

function configureWebPush() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_KEY;
  const privateKey = process.env.PRIVATE_VAPID_KEY;

  if (!publicKey || !privateKey) {
    return false;
  }

  webPush.setVapidDetails(
    "mailto:jonas.dally@hotmail.de",
    publicKey,
    privateKey
  );
  return true;
}

async function isAuthorizedRequest(request, response) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.authorization;

  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    return true;
  }

  const session = await getServerSession(request, response, authOptions);
  if (session?.user?.id) {
    return true;
  }

  return !cronSecret;
}

async function resolveSubscription(plant) {
  if (plant.userSubscription?.endpoint) {
    return plant.userSubscription;
  }

  if (!plant.userId) {
    return null;
  }

  const user = await User.findById(plant.userId).select("userSubscription");
  return user?.userSubscription?.endpoint ? user.userSubscription : null;
}

function buildNotificationPayload(plant, nextAlarmDate) {
  const intervalDays =
    Number(plant.wateringinterval) > 0 ? Number(plant.wateringinterval) : 7;
  const nextDateText = nextAlarmDate.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return JSON.stringify({
    title: `Erinnerung: ${plant.plantname} gießen!`,
    body: `Zeit zum Gießen (Intervall: ${intervalDays} Tage). Nächste Erinnerung am ${nextDateText}.`,
    icon: "/icons/icon-192x192.png",
    url: "/alarm",
  });
}

async function sendPlantAlarm(plant, now) {
  const subscription = await resolveSubscription(plant);
  if (!subscription) {
    return { sent: false, reason: "missing_subscription" };
  }

  const nextAlarmDate = calculateNextRecurringAlarm(
    plant.alarmTime,
    plant.wateringinterval,
    now
  );

  try {
    await webPush.sendNotification(
      subscription,
      buildNotificationPayload(plant, nextAlarmDate)
    );

    plant.lastAlarmSentAt = now;
    plant.alarmTime = nextAlarmDate;
    plant.nextAlarmTime = nextAlarmDate;
    plant.alarmActive = true;
    await plant.save();

    return { sent: true };
  } catch (error) {
    if (error.statusCode === 404 || error.statusCode === 410) {
      plant.userSubscription = null;
      await plant.save();
      if (plant.userId) {
        await User.findByIdAndUpdate(plant.userId, {
          $unset: { userSubscription: "" },
        });
      }
    }
    return { sent: false, reason: error.message };
  }
}

export default async function handler(request, response) {
  if (request.method !== "GET" && request.method !== "POST") {
    return response.status(405).json({ error: "Methode nicht erlaubt." });
  }

  const authorized = await isAuthorizedRequest(request, response);
  if (!authorized) {
    return response.status(401).json({ error: "Nicht autorisiert." });
  }

  if (!configureWebPush()) {
    return response
      .status(500)
      .json({ error: "VAPID-Schlüssel sind nicht konfiguriert." });
  }

  try {
    await dbConnect();

    const now = new Date();
    const duePlants = await Plant.find({
      alarmActive: true,
      alarmTime: { $lte: now },
      $or: [
        { lastAlarmSentAt: null },
        { lastAlarmSentAt: { $exists: false } },
        { $expr: { $lt: ["$lastAlarmSentAt", "$alarmTime"] } },
      ],
    });

    if (duePlants.length === 0) {
      return response.status(200).json({
        success: true,
        sentCount: 0,
        message: "Keine fälligen Alarme gefunden.",
      });
    }

    const results = await Promise.all(
      duePlants.map((plant) => sendPlantAlarm(plant, now))
    );
    const sentCount = results.filter((result) => result.sent).length;

    return response.status(200).json({
      success: true,
      sentCount,
      totalDue: duePlants.length,
      message: `${sentCount} Benachrichtigung(en) gesendet.`,
    });
  } catch (error) {
    return response
      .status(500)
      .json({ error: "Fehler beim Prüfen der Alarme." });
  }
}
