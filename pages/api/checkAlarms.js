
import dotenv from 'dotenv'
dotenv.config({ path: '../../.env.local' })

// import "dotenv/config"; 

import Plant from "../../db/models/Plant.js";
import webPush from 'web-push';

import dbConnect from "../../db/connect.js";

setInterval(() => { console.log(`Script started`); }, 5 * 1000);


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


export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Methode nicht erlaubt.' });
  }

  try {

    await dbConnect();

    const now = new Date();

    const currentDate = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}, ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const futureTime = new Date(now.getTime() + 5 * 60000);

    const futureTimeString = `${futureTime.getDate().toString().padStart(2, '0')}.${(futureTime.getMonth() + 1).toString().padStart(2, '0')}.${futureTime.getFullYear()}, ${futureTime.getHours()}:${futureTime.getMinutes().toString().padStart(2, '0')}`;

    setInterval(() => { console.log(`Prüfe Alarme zwischen ${currentDate} und ${futureTimeString}`); }, 5 * 1000);
    
    
    const plantsWithAlarms = await Plant.find({
      alarmActive: true,
      alarmTime: { $gte: currentDate, $lte: futureTimeString }
    });
    
    console.log(`Gefundene Pflanzen mit Alarm zwischen ${currentDate} und ${futureTimeString}:`, plantsWithAlarms);
    setInterval(() => { console.log(`gefundene Pflanze: ${plantsWithAlarms}`); }, 15 * 1000);


    if (plantsWithAlarms.length === 0) {
      console.log("Keine Pflanzen mit aktivem Alarm gefunden.");
      return res.status(204).json({ success: false, message: 'Keine Benachrichtigungen gesendet.' });
    }

    const notificationPromises = plantsWithAlarms.map((plant) => {
      const payload = JSON.stringify({
        title: `Erinnerung: ${plant.plantname} gießen!`,
        body: `Es ist Zeit, deine Pflanze "${plant.plantname}" zu gießen.`,
      });

      const subscription = plant.userSubscription;

      return webPush.sendNotification(subscription, payload).catch((err) => {
        console.error('Fehler beim Senden der Benachrichtigung:', err);
      });
    });

    await Promise.all(notificationPromises);

    res.status(200).json({ success: true, message: `${plantsWithAlarms.length} Benachrichtigung(en) gesendet.` });
  } catch (error) {
    console.error('Fehler beim Prüfen der Alarme:', error);
    res.status(500).json({ error: 'Fehler beim Prüfen der Alarme.' });
  }
}
