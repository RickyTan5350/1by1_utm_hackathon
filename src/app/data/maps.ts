export interface ZooMap {
  id: string;
  name: string;
  emoji: string;
  description: string;
  animalIds: string[]; // Which animals belong to this habitat
  color: {
    from: string;
    to: string;
  };
  imageUrl: string; // Habitat background image
}

export const zooMaps: ZooMap[] = [
  {
    id: 'grassland',
    name: 'Green Grassland',
    emoji: '🌾',
    description: 'Peaceful grassland with friendly animals',
    animalIds: ['1', '2', '3', '4'], // Sheep, Cow, Chicken, Pig
    color: { from: 'from-green-400', to: 'to-green-600' },
    // Put images in /public/img and reference as /img/...
    imageUrl: '/img/grassland.jpg'
  },
  {
    id: 'desert',
    name: 'Sandy Desert',
    emoji: '🏜️',
    description: 'Hot desert with brave desert animals',
    animalIds: ['5', '7', '8'], // Horse, Lion, Elephant
    color: { from: 'from-yellow-400', to: 'to-orange-600' },
    imageUrl: '/img/desert.jpg'
  },
  {
    id: 'arctic',
    name: 'Frozen Arctic',
    emoji: '❄️',
    description: 'Icy wonderland of arctic creatures',
    animalIds: ['6', '11', '12'], // Panda, Bear, Penguin
    color: { from: 'from-cyan-400', to: 'to-blue-600' },
    imageUrl: '/img/arctic.jpg'
  },
  {
    id: 'jungle',
    name: 'Mystic Jungle',
    emoji: '🌴',
    description: 'Lush jungle home to exotic animals',
    animalIds: ['9', '10', '11'], // Rabbit, Fox, Bear
    color: { from: 'from-emerald-400', to: 'to-emerald-700' },
    imageUrl: '/img/jungle.jpg'
  }
];

export function getAnimalsForMap(mapId: string, allAnimals: any[]) {
  const map = zooMaps.find(m => m.id === mapId);
  if (!map) return [];
  return allAnimals.filter(animal => map.animalIds.includes(animal.id));
}
