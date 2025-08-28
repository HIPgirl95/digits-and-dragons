// /utils/combat.js

// Dice roller
function rollDice(diceStr) {
  const match = diceStr.match(/(\d+)d(\d+)([+-]\d+)?/);
  if (!match) return 0;

  const numDice = parseInt(match[1]);
  const diceSides = parseInt(match[2]);
  const modifier = match[3] ? parseInt(match[3]) : 0;

  let total = 0;
  for (let i = 0; i < numDice; i++) {
    total += Math.floor(Math.random() * diceSides) + 1;
  }
  return total + modifier;
}

// Apply move (damage or heal) to a target
// Expects a fresh object from state
function applyMove(move, source, target) {
  if (!target) {
    console.warn(`applyMove called with undefined target`);
    return 0; // return 0 if no target
  }

  let amount = 0;

  if (move.type === "damage") {
    amount = rollDice(move.damage);
    target.hp -= amount;
    if (target.hp < 0) target.hp = 0;
    console.log(
      `${source.name} uses ${move.name} on ${target.name} for ${amount} damage!`
    );
  } else if (move.type === "heal") {
    amount = rollDice(move.heal);
    target.hp += amount;
    if (target.hp > target.maxHp) target.hp = target.maxHp; // prevent overheal
    console.log(
      `${source.name} uses ${move.name} on ${target.name}, healing ${amount} HP!`
    );
  } else {
    console.warn(`${move.name} has an unknown type.`);
  }

  return amount; // ✅ return the actual amount applied
}

export { rollDice, applyMove };
