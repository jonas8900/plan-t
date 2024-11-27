import Plant from "@/db/models/Plant";


export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { plantId, subscription } = req.body;

    try {
      const plant = await Plant.findById(plantId);

      if (!plant) {
        return res.status(404).json({ error: 'Pflanze nicht gefunden.' });
      }

      plant.userSubscription = subscription;
      await plant.save();

      res.status(200).json({ success: true, message: 'Subscription gespeichert!' });
    } catch (error) {
      console.error('Fehler beim Speichern der Subscription:', error);
      res.status(500).json({ error: 'Fehler beim Speichern der Subscription.' });
    }
  } else {
    res.status(405).json({ error: 'Methode nicht erlaubt.' });
  }
}
