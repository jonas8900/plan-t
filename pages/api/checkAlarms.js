
import Plant from '@/db/models/Plant';
import webPush from 'web-push';




webPush.setVapidDetails(
  'mailto:jonas.dally@hotmail.de',
  process.env.PUBLIC_VAPID_KEY,
  process.env.PRIVATE_VAPID_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Methode nicht erlaubt.' });
  }

  try {
    const now = new Date();
    const currentTime = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    const plantsWithAlarms = await Plant.find({
      alarmActive: true,
      alarmTime: currentTime,
    });

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

    res.status(200).json({ success: true, message: 'Benachrichtigungen gesendet.' });
  } catch (error) {
    console.error('Fehler beim Prüfen der Alarme:', error);
    res.status(500).json({ error: 'Fehler beim Prüfen der Alarme.' });
  }
}
