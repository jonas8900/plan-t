import dotenv from "dotenv";
dotenv.config({ path: "../../.env.local" });

import Plant from "../../db/models/Plant.js";
import dbConnect from "../../db/connect.js";
import webPush from "web-push";

const publicKey = process.env.NEXT_PUBLIC_VAPID_KEY;
const privateKey = process.env.PRIVATE_VAPID_KEY;



if (!publicKey || !privateKey) {
  console.error('Fehlende VAPID-Schlüssel');

} else {
  webPush.setVapidDetails(
    'mailto:jonas.dally@hotmail.de', 
    publicKey,  
    privateKey  

  );
}

console.log("Cronjob gestartet");

async function runCheck() {

  try {
    await dbConnect();

    const now = new Date();
    const future = new Date(now.getTime() + 5 * 60000);


    const plantsWithAlarms = await Plant.find({
      alarmActive: true,
      alarmTime: { $gte: now, $lte: future }
    });

        if (plantsWithAlarms.length === 0) {
          console.log("Keine Pflanzen mit aktivem Alarm gefunden.");
          return console.log("keine Pflanze gefunden.");
        }
    
        const notificationPromises = plantsWithAlarms.map((plant) => {
          const payload = JSON.stringify({

            title: `Erinnerung: ${plant.plantname} gießen!`,
            body: `Es ist Zeit, deine Pflanze "${plant.plantname}" zu gießen.`,
          });
    
          const subscription = plant.userSubscription;
    
        return webPush.sendNotification(subscription, payload).catch((err) => {
            console.error('Fehler beim Senden der Benachrichtigung:', {
                message: err.message,
                statusCode: err.statusCode,
                body: err.body,
                });
            });
        });

        await Promise.all(notificationPromises);

        plantsWithAlarms.alarmSent = true;
        await plantsWithAlarms.save();

      }  catch (err) {
    console.error("Fehler im Cronjob:", err);
  }
}

runCheck();

setInterval(runCheck, 15 * 1000);
