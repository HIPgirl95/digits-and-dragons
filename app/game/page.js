"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Layout from "../../components/layout";
import { classes } from "../data/classes";
import { enemies } from "../data/enemies";
import { applyMove } from "../utils/combat";

export default function Game() {
  const router = useRouter();

  // Initialize players and enemy
  const [players, setPlayers] = useState(
    classes.slice(0, 2).map((p) => ({ ...p, hp: p.maxHp }))
  );
  const [enemy, setEnemy] = useState({ ...enemies[0], hp: enemies[0].maxHp });
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [log, setLog] = useState([]);

  const allPlayersDead = players.every((p) => p.hp <= 0);
  const enemyDead = enemy.hp <= 0;

  // Memoize participants array to keep it stable
  const participants = useMemo(() => {
    return [
      ...players.map((p) => ({ ...p, type: "player" })),
      { ...enemy, type: "enemy" },
    ];
  }, [players, enemy]);

  // Advance to next alive participant
  const nextTurn = useCallback(() => {
    let nextIndex = (currentTurnIndex + 1) % participants.length;

    while (participants[nextIndex].hp <= 0) {
      nextIndex = (nextIndex + 1) % participants.length;
    }

    setCurrentTurnIndex(nextIndex);
  }, [currentTurnIndex, participants]);

  // Enemy turn effect
  useEffect(() => {
    if (enemyDead || allPlayersDead) return;

    const current = participants[currentTurnIndex];
    if (current.hp <= 0) {
      // Skip dead participants automatically
      const nextIndex = (currentTurnIndex + 1) % participants.length;
      setCurrentTurnIndex(nextIndex);
      return;
    }

    if (current.type === "enemy") {
      // Enemy automatically attacks
      const move = enemy.moves[Math.floor(Math.random() * enemy.moves.length)];

      const alivePlayers = players.filter((p) => p.hp > 0);
      if (alivePlayers.length === 0) return;

      const target =
        alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
      const targetIndex = players.findIndex((p) => p.id === target.id);

      setTimeout(() => {
        setPlayers((prev) => {
          const newPlayers = [...prev];
          applyMove(move, enemy, newPlayers[targetIndex]);
          setLog((prevLog) => [
            ...prevLog,
            `${enemy.name} used ${move.name} on ${target.name}!`,
          ]);
          return newPlayers;
        });
        setCurrentTurnIndex((prev) => (prev + 1) % participants.length);
      }, 1000);
    }
    // Players’ turns are triggered by button click, which also advances the turn
  }, [
    currentTurnIndex,
    participants,
    players,
    enemy,
    enemyDead,
    allPlayersDead,
  ]);

  // Player move handler
  const handlePlayerMove = (move, playerIndex) => {
    if (enemyDead) return;

    setEnemy((prev) => {
      const newEnemy = { ...prev };
      applyMove(move, players[playerIndex], newEnemy);
      return newEnemy;
    });

    setLog((prev) => [
      ...prev,
      `${players[playerIndex].name} used ${move.name}!`,
    ]);

    nextTurn();
  };

  // Health bar component
  const HealthBar = ({ current, max }) => {
    const percentage = Math.max(0, (current / max) * 100);
    return (
      <div
        style={{
          background: "#444",
          width: "150px",
          height: "15px",
          borderRadius: "5px",
          overflow: "hidden",
          marginBottom: "5px",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            background: "#0f0",
            transition: "width 0.3s ease",
          }}
        />
      </div>
    );
  };

  return (
    <Layout>
      <h1>Dragons</h1>
      <button onClick={() => router.push("/")}>Start Over</button>

      <div style={{ marginTop: "20px" }}>
        <h2>
          Enemy: {enemy.name} - HP: {enemy.hp}/{enemy.maxHp}
        </h2>
        <HealthBar current={enemy.hp} max={enemy.maxHp} />
        {participants[currentTurnIndex]?.type === "enemy" && !enemyDead && (
          <p style={{ fontWeight: "bold" }}>Enemy&#39;s Turn!</p>
        )}
      </div>

      <div>
        {players.map((player, index) => (
          <div key={player.id} style={{ marginBottom: "20px" }}>
            <h3>
              {player.name} - HP: {player.hp}/{player.maxHp}
            </h3>
            <HealthBar current={player.hp} max={player.maxHp} />
            {participants[currentTurnIndex]?.type === "player" &&
              participants[currentTurnIndex]?.id === player.id &&
              player.hp > 0 &&
              !enemyDead && (
                <div>
                  <p style={{ fontWeight: "bold" }}>Your Turn!</p>
                  {player.moves.map((move) => (
                    <button
                      key={move.id}
                      style={{ marginRight: "5px", marginBottom: "5px" }}
                      onClick={() => handlePlayerMove(move, index)}
                    >
                      {move.name}
                    </button>
                  ))}
                </div>
              )}
          </div>
        ))}
      </div>

      <div>
        <h2>Combat Log:</h2>
        <ul>
          {log.map((entry, i) => (
            <li key={i}>{entry}</li>
          ))}
        </ul>
      </div>

      {enemyDead && <h2>Victory! The enemy has been defeated!</h2>}
      {allPlayersDead && <h2>Defeat! All players have fallen.</h2>}
    </Layout>
  );
}
