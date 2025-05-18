
export interface Material {
  id: string;
  name: string;
  baseColor: string; // hex or Tailwind color
  meltedColor: string; // e.g., 'bg-transparent' or a puddle color
  meltSpeedFactor: number; // For future animation differences
  sound: string; // Placeholder for sound effect key
}

export interface Sculpture {
  id: string;
  name: string;
  grid: boolean[][]; // true for solid, false for empty
  defaultMaterialId: string;
}

export const MATERIALS: Material[] = [
  {
    id: 'ice',
    name: 'Ice',
    baseColor: 'bg-blue-300', // A light icy blue
    meltedColor: 'bg-blue-100/30', // Faded, almost transparent
    meltSpeedFactor: 1,
    sound: 'melt_ice',
  },
  {
    id: 'chocolate',
    name: 'Chocolate',
    baseColor: 'bg-yellow-700', // A chocolatey brown
    meltedColor: 'bg-yellow-800/30',
    meltSpeedFactor: 0.8,
    sound: 'melt_chocolate',
  },
  {
    id: 'wax',
    name: 'Wax',
    baseColor: 'bg-amber-300', // A waxy yellow
    meltedColor: 'bg-amber-200/30',
    meltSpeedFactor: 1.2,
    sound: 'melt_wax',
  }
];

const simpleSquare = (size: number, fill: boolean = true): boolean[][] => {
  return Array(size).fill(null).map(() => Array(size).fill(fill));
};

const simpleHeart: boolean[][] = [
  [false, true, true, false, true, true, false],
  [true, true, true, true, true, true, true],
  [true, true, true, true, true, true, true],
  [false, true, true, true, true, true, false],
  [false, false, true, true, true, false, false],
  [false, false, false, true, false, false, false],
];


export const SCULPTURES: Sculpture[] = [
  {
    id: 'small-block',
    name: 'Small Block',
    grid: simpleSquare(5),
    defaultMaterialId: 'ice',
  },
  {
    id: 'medium-block',
    name: 'Solid Cube',
    grid: simpleSquare(8),
    defaultMaterialId: 'ice',
  },
  {
    id: 'simple-heart',
    name: 'Pixel Heart',
    grid: simpleHeart,
    defaultMaterialId: 'chocolate',
  },
  {
    id: 'long-bar',
    name: 'Bar',
    grid: Array(3).fill(null).map(() => Array(10).fill(true)),
    defaultMaterialId: 'wax',
  }
];

export const getDefaultMaterial = (): Material => MATERIALS.find(m => m.id === SCULPTURES[0].defaultMaterialId) || MATERIALS[0];
export const getDefaultSculpture = (): Sculpture => SCULPTURES[0];
