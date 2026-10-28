export function handleWateringInterval(plant) {
  const lastWatering = new Date(plant.lastwatering);
  const nextWatering = new Date(lastWatering);
  nextWatering.setDate(nextWatering.getDate() + plant.wateringinterval);

  const today = new Date();
  const diff = nextWatering.getTime() - today.getTime();
  const days = Math.ceil(diff / (1000 * 3600 * 24));

  if (days === 1) return "Morgen";
  if (days === 0) return "Heute";
  return `${days} Tage`;
}

export function isPushSupported() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

export async function requestPushSubscription() {
  if (!isPushSupported()) {
    throw new Error("Push-Benachrichtigungen werden von diesem Browser nicht unterstützt.");
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Benachrichtigungen wurden nicht erlaubt.");
  }

  const registration = await navigator.serviceWorker.ready;
  const existingSubscription = await registration.pushManager.getSubscription();
  if (existingSubscription) {
    return existingSubscription;
  }

  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_KEY;
  if (!vapidPublicKey) {
    throw new Error("VAPID-Schlüssel ist nicht konfiguriert.");
  }

  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
  });
}

export function formatAlarmDateTime(dateValue) {
  if (!dateValue) {
    return { dateLabel: "--.--.----", timeLabel: "--:--" };
  }

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    if (typeof dateValue === "string" && dateValue.includes(",")) {
      const [rawDate, rawTime] = dateValue.split(",");
      return {
        dateLabel: rawDate.trim(),
        timeLabel: rawTime.trim(),
      };
    }
    return { dateLabel: "--.--.----", timeLabel: "--:--" };
  }

  const dateLabel = parsedDate.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const timeLabel = parsedDate.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return { dateLabel, timeLabel };
}

export function calculateNextRecurringAlarm(
  baseDate,
  intervalDays = 7,
  referenceNow = new Date()
) {
  const stepDays = Number(intervalDays) > 0 ? Number(intervalDays) : 7;
  const nextDate = new Date(baseDate);

  if (Number.isNaN(nextDate.getTime())) {
    const fallback = new Date(referenceNow);
    fallback.setDate(fallback.getDate() + stepDays);
    return fallback;
  }

  do {
    nextDate.setDate(nextDate.getDate() + stepDays);
  } while (nextDate <= referenceNow);

  return nextDate;
}

export function calculateSuggestedAlarmDate(plant, now = new Date()) {
  const intervalDays =
    Number(plant?.wateringinterval) > 0 ? Number(plant.wateringinterval) : 7;
  const existingAlarm = plant?.alarmTime ? new Date(plant.alarmTime) : null;
  const defaultHours =
    existingAlarm && !Number.isNaN(existingAlarm.getTime())
      ? existingAlarm.getHours()
      : 9;
  const defaultMinutes =
    existingAlarm && !Number.isNaN(existingAlarm.getTime())
      ? existingAlarm.getMinutes()
      : 0;

  const lastWatering = plant?.lastwatering ? new Date(plant.lastwatering) : null;

  if (lastWatering && !Number.isNaN(lastWatering.getTime())) {
    const candidate = new Date(lastWatering);
    candidate.setHours(defaultHours, defaultMinutes, 0, 0);
    candidate.setDate(candidate.getDate() + intervalDays);

    if (candidate > now) {
      return candidate;
    }
  }

  const fallback = new Date(now);
  fallback.setHours(defaultHours, defaultMinutes, 0, 0);
  if (fallback <= now) {
    fallback.setDate(fallback.getDate() + 1);
  }
  return fallback;
}

export function formatDateTimeLocalInput(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
