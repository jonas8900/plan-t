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
