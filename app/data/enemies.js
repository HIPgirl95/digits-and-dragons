export const enemies = [
  {
    id: 1001,
    name: "Dragon",
    maxHp: 100,
    hp: 100,
    moves: [
      { id: 1, name: "Fire Breath", type: "damage", damage: "3d6+5" },
      { id: 2, name: "Tail Swipe", type: "damage", damage: "2d8+3" },
    ],
  },
  {
    id: 1002,
    name: "Lich",
    maxHp: 80,
    hp: 80,
    moves: [
      { id: 1, name: "Necrotic Touch", type: "damage", damage: "2d6+4" },
      { id: 2, name: "Curse", type: "damage", damage: "1d8+2" },
    ],
  },
];
