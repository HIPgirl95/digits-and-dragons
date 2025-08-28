"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Layout from "../../components/layout";
import { classes } from "../data/classes";
import { enemies } from "../data/enemies";
import { additionQuestions } from "../data/math/addition"; // ✅ import your quiz data
import { applyMove } from "../utils/combat";

export default function Game() {
  const router = useRouter();

  // Initialize players and enemy
  const [players, setPlayers] = useState(
    classes.map((p) => ({ ...p, hp: p.maxHp }))
  );
  const [enemy, setEnemy] = useState({ ...enemies[0], hp: enemies[0].maxHp });
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [log, setLog] = useState([]);
  const [lineup, setLineup] = useState([]);

  // quiz states
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showMoves, setShowMoves] = useState(false);
  const [feedback, setFeedback] = useState(""); // ✅ for wrong answer message

  const allPlayersDead = players.every((p) => p.hp <= 0);
  const enemyDead = enemy.hp <= 0;

  function shuffleArray(array) {
    if (!Array.isArray(array)) {
      return [];
    }
    return [...array].sort(() => Math.random() - 0.5);
  }

  // Advance to next alive participant
  const nextTurn = useCallback(() => {
    if (lineup.length === 0) return;

    let nextIndex = (currentTurnIndex + 1) % lineup.length;

    // Skip over dead participants automatically
    while (lineup[nextIndex]?.hp <= 0) {
      nextIndex = (nextIndex + 1) % lineup.length;
    }

    setCurrentTurnIndex(nextIndex);
  }, [currentTurnIndex, lineup]);

  // Enemy turn effect
  useEffect(() => {
    if (enemyDead || allPlayersDead) return;
    if (lineup.length === 0) return;

    const current = lineup[currentTurnIndex];
    if (!current) return;

    if (current.hp <= 0) {
      nextTurn();
      return;
    }

    if (current.type === "enemy") {
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
        nextTurn();
      }, 1000);
    }
  }, [
    currentTurnIndex,
    players,
    enemy,
    enemyDead,
    allPlayersDead,
    lineup,
    nextTurn,
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

    setShowMoves(false);
    nextTurn();
  };

  // Answer handler
  const handleAnswer = (option, participant) => {
    if (option.isCorrect) {
      setLog((prev) => [...prev, `${participant.name} answered correctly!`]);
      setFeedback("");
      setShowMoves(true);
    } else {
      setFeedback(
        `Wrong! The correct answer was: ${
          currentQuestion.options.find((o) => o.isCorrect)?.text
        }`
      );
      setLog((prev) => [...prev, `${participant.name} answered wrong!`]);

      setTimeout(() => {
        setFeedback("");
        nextTurn();
      }, 1500); // auto-advance after showing feedback
    }
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

  // Setup lineup on mount
  useEffect(() => {
    if (lineup.length === 0) {
      setLineup(
        shuffleArray([
          ...players.map((p) => ({ ...p, type: "player" })),
          { ...enemy, type: "enemy" },
        ])
      );
    }
  }, [players, enemy, lineup]);

  // When it’s a player’s turn, load a random question
  useEffect(() => {
    const current = lineup[currentTurnIndex];
    if (current && current.type === "player") {
      const q =
        additionQuestions[Math.floor(Math.random() * additionQuestions.length)];
      setCurrentQuestion(q);
      setShowMoves(false);
    }
  }, [currentTurnIndex, lineup]);

  return (
    <Layout>
      <h1>Dragons</h1>
      <button onClick={() => router.push("/")}>Back to Home</button>
      <button onClick={() => window.location.reload()}>Start Over</button>

      <div>
        {lineup.map((participantRef, idx) => {
          const participant =
            participantRef.type === "player"
              ? players.find((p) => p.id === participantRef.id)
              : enemy;

          if (!participant) return null;

          const isCurrent = currentTurnIndex === idx;
          const isEnemy = participantRef.type === "enemy";

          return (
            <div key={participant.id} style={{ marginBottom: "20px" }}>
              <h3>
                {participant.name} - HP: {participant.hp}/{participant.maxHp}
              </h3>
              <HealthBar current={participant.hp} max={participant.maxHp} />

              {isCurrent && !enemyDead && !allPlayersDead && (
                <div>
                  <p style={{ fontWeight: "bold" }}>
                    {isEnemy ? "Enemy's Turn!" : "Your Turn!"}
                  </p>

                  {/* Player Turn: Show Question First */}
                  {!isEnemy && currentQuestion && !showMoves && (
                    <div>
                      <p>{currentQuestion.question}</p>
                      {shuffleArray(currentQuestion.options).map((opt, i) => (
                        <button
                          key={i}
                          style={{ marginRight: "5px", marginBottom: "5px" }}
                          onClick={() => handleAnswer(opt, participant)}
                        >
                          {opt.text}
                        </button>
                      ))}
                      {feedback && <p style={{ color: "red" }}>{feedback}</p>}
                    </div>
                  )}

                  {/* If answered correctly, show moves */}
                  {!isEnemy && showMoves && (
                    <div>
                      {participant.moves.map((move) => (
                        <button
                          key={move.id}
                          style={{ marginRight: "5px", marginBottom: "5px" }}
                          onClick={() =>
                            handlePlayerMove(
                              move,
                              players.findIndex((p) => p.id === participant.id)
                            )
                          }
                        >
                          {move.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
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
