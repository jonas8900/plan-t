export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Methode nicht erlaubt.' });
  }

  try {
    const now = new Date();
    const currentDate = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}, ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    const futureTime = new Date(now.getTime() + 5 * 60000);
    const futureTimeString = `${futureTime.getDate().toString().padStart(2, '0')}.${(futureTime.getMonth() + 1).toString().padStart(2, '0')}.${futureTime.getFullYear()}, ${futureTime.getHours()}:${futureTime.getMinutes().toString().padStart(2, '0')}`;


    const plantsWithAlarms = await Plant.find({
      alarmActive: true,
      alarmTime: { $gte: currentDate, $lte: futureTimeString }
    });

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
