export function handleWateringInterval(plant) {
    const lastWatering = new Date(plant.lastwatering);
    const nextWatering = new Date(
        lastWatering.setDate(lastWatering.getDate() + plant.wateringinterval)
    );
    const today = new Date();
    const diff = nextWatering.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    if (days === 1) return "Morgen";
    if (days === 0) return "Heute";
    return days + " Tage";
}


export async function requestPushSubscription() {
  try {
      const permission = await Notification.requestPermission();

      if (permission !== 'granted') {
          throw new Error('Benachrichtigungen sind nicht erlaubt');
      }
      console.log("Test")
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_KEY,
      });
      console.log("Test2")
      return subscription;
  } catch (error) {
      console.error('Fehler in requestPushSubscription:', error);
      throw error;
  }
}

