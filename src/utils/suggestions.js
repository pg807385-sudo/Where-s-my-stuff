// All suggestions are derived from patterns in the user's own local data —
// no network calls, no AI API.
const DAY_MS = 1000 * 60 * 60 * 24

export function buildSuggestions(items) {
  const suggestions = []
  if (items.length === 0) return suggestions

  const now = Date.now()

  // 1) Items that haven't moved in 30+ days
  const stale = items
    .filter((i) => now - new Date(i.updatedAt).getTime() > 30 * DAY_MS)
    .sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))

  if (stale[0]) {
    const days = Math.floor((now - new Date(stale[0].updatedAt).getTime()) / DAY_MS)
    suggestions.push({
      id: `stale-${stale[0].id}`,
      icon: 'clock',
      text: `You haven't updated your ${stale[0].name.toLowerCase()} location in ${days} days.`,
    })
  }

  // 2) Location with the most items
  const counts = {}
  for (const i of items) {
    if (!i.location) continue
    counts[i.location] = (counts[i.location] || 0) + 1
  }
  const topLocation = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
  if (topLocation && topLocation[1] >= 2) {
    suggestions.push({
      id: `top-location-${topLocation[0]}`,
      icon: 'map-pin',
      text: `You have ${topLocation[1]} items stored in ${topLocation[0]}.`,
    })
  }

  // 3) Items whose name suggests they're easy to misplace, if a consistent home is known
  const keyLike = items.find((i) => /key|keys/i.test(i.name))
  if (keyLike) {
    suggestions.push({
      id: `keys-${keyLike.id}`,
      icon: 'key-round',
      text: `You usually keep your ${keyLike.name.toLowerCase()} at ${keyLike.location}.`,
    })
  }

  // 4) Upcoming reminder nudge
  const upcoming = items
    .filter((i) => i.reminder && new Date(i.reminder).getTime() > now)
    .sort((a, b) => new Date(a.reminder) - new Date(b.reminder))[0]
  if (upcoming) {
    suggestions.push({
      id: `reminder-${upcoming.id}`,
      icon: 'bell',
      text: `Don't forget your ${upcoming.name.toLowerCase()} — reminder set for ${new Date(
        upcoming.reminder
      ).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}.`,
    })
  }

  // 5) Encourage adding a photo if none exist yet
  const noPhotos = items.every((i) => !i.photo)
  if (noPhotos && items.length >= 2) {
    suggestions.push({
      id: 'add-photos',
      icon: 'camera',
      text: `Add a photo to an item so it's easier to spot at a glance.`,
    })
  }

  return suggestions.slice(0, 4)
}
