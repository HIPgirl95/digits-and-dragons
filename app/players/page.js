"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Layout from "../../components/layout";
import { useGame } from "../context/gameContext";
import { classes } from "../data/classes"; // [{ name: "Warrior", image: "/images/warrior.png" }, ...]

export default function PlayersPage() {
  const router = useRouter();
  const { subjects, setPlayers } = useGame();
  const [numPlayers, setNumPlayers] = useState(1);
  const [players, setLocalPlayers] = useState([
    { name: "", class: classes[0] },
  ]);

  if (!subjects || subjects.length === 0) {
    return (
      <Layout>
        <h1>No subjects selected!</h1>
        <button
          onClick={() => router.push("/subject")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Back to Subject Selection
        </button>
      </Layout>
    );
  }

  const handleNumPlayersChange = (e) => {
    const count = parseInt(e.target.value);
    setNumPlayers(count);
    setLocalPlayers(
      Array.from(
        { length: count },
        (_, i) => players[i] || { name: "", class: classes[0] }
      )
    );
  };

  const handleNameChange = (index, value) => {
    const updated = [...players];
    updated[index].name = value;
    setLocalPlayers(updated);
  };

  const handleClassChange = (index, value) => {
    const updated = [...players];
    const chosenClass = classes.find((cls) => cls.name === value);
    updated[index].class = chosenClass;
    setLocalPlayers(updated);
  };

  const handleStart = () => {
    setPlayers(players);
    router.push("/game");
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Players Setup</h1>
      <p className="mb-4">Subjects: {subjects.join(", ")}</p>

      <div className="mb-6">
        <label className="mr-2 font-medium">Number of Players:</label>
        <select
          value={numPlayers}
          onChange={handleNumPlayersChange}
          className="border px-2 py-1 rounded"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4 mb-6">
        {players.map((player, i) => (
          <div key={i} className="p-4 border rounded shadow">
            <h2 className="font-semibold mb-2">Player {i + 1}</h2>
            <input
              type="text"
              placeholder="Enter name"
              value={player.name}
              onChange={(e) => handleNameChange(i, e.target.value)}
              className="border px-2 py-1 rounded w-full mb-2"
            />
            <select
              value={player.class.name}
              onChange={(e) => handleClassChange(i, e.target.value)}
              className="border px-2 py-1 rounded w-full"
            >
              {classes.map((cls) => (
                <option key={cls.name} value={cls.name}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <button
        className="px-4 py-2 bg-green-500 text-white rounded"
        onClick={handleStart}
      >
        Start Game
      </button>
    </Layout>
  );
}
