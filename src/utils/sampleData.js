// Seed data shown on first launch, so the app never feels empty out of the box.
const daysAgo = (n) => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

export const SAMPLE_ITEMS = [
  {
    id: 'seed-1',
    name: 'Calculator',
    location: 'Blue desk drawer',
    description: 'My science calculator',
    photo: null,
    reminder: null,
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
  {
    id: 'seed-2',
    name: 'House keys',
    location: 'Entrance table',
    description: '',
    photo: null,
    reminder: null,
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
  {
    id: 'seed-3',
    name: 'USB-C charger',
    location: 'Backpack',
    description: 'Fast charger, white cable',
    photo: null,
    reminder: null,
    createdAt: daysAgo(5),
    updatedAt: daysAgo(5),
  },
  {
    id: 'seed-4',
    name: 'School notebook',
    location: 'Bedroom shelf',
    description: '',
    photo: null,
    reminder: null,
    createdAt: daysAgo(35),
    updatedAt: daysAgo(35),
  },
]
