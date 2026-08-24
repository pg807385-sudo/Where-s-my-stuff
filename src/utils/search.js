// Strips filler words from natural questions like "Where is my calculator?"
// so the remaining tokens can be matched against item fields.
const STOP_WORDS = new Set([
  'where', 'is', 'are', 'my', 'the', 'a', 'an', 'i', 'put', 'placed',
  'find', 'in', 'at', 'for', 'of', 'things', 'thing', 'stuff', 'located',
  'location', 'me', 'to', "what's", 'whats', 'was', 'did', 'leave', 'left',
])

function normalize(str) {
  return (str || '').toLowerCase().trim()
}

function tokenize(query) {
  return normalize(query)
    .replace(/[?!.,]/g, '')
    .split(/\s+/)
    .filter((w) => w && !STOP_WORDS.has(w))
}

function scoreItem(item, rawQuery, tokens) {
  const q = normalize(rawQuery).replace(/[?!.,]/g, '')
  const name = normalize(item.name)
  const location = normalize(item.location)
  const description = normalize(item.description)

  let score = 0

  // Strong signals: exact / substring match on the full cleaned query
  if (q && name === q) score += 100
  if (q && name.includes(q)) score += 40
  if (q && location.includes(q)) score += 30
  if (q && description.includes(q)) score += 10

  // Token-level signals, so "blue drawer" matches "Blue desk drawer"
  for (const token of tokens) {
    if (name.includes(token)) score += 12
    if (location.includes(token)) score += 9
    if (description.includes(token)) score += 4
  }

  return score
}

export function searchItems(items, rawQuery) {
  const q = normalize(rawQuery)
  if (!q) return []
  const tokens = tokenize(rawQuery)
  return items
    .map((item) => ({ item, score: scoreItem(item, rawQuery, tokens) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.item)
}
