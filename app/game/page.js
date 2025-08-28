"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Layout from "../../components/layout";
import { classes } from "../data/classes";
import { enemies } from "../data/enemies";
import { additionQuestions } from "../data/math/addition";
import { applyMove } from "../utils/combat";
import styles from "./game.module.css";

export default function Game() {
  const router = useRouter();

  const [players, setPlayers] = useState(
    classes.map((p) => ({ ...p, hp: p.maxHp }))
  );
  const [enemy, setEnemy] = useState({ ...enemies[0], hp: enemies[0].maxHp });
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [log, setLog] = useState([]);
  const [lineup, setLineup] = useState([]);

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showMoves, setShowMoves] = useState(false);
  const [feedback, setFeedback] = useState("");

  const allPlayersDead = players.every((p) => p.hp <= 0);
  const enemyDead = enemy.hp <= 0;
  const gameOver = allPlayersDead || enemyDead;

  function shuffleArray(array) {
    if (!Array.isArray(array)) return [];
    return [...array].sort(() => Math.random() - 0.5);
  }

  const nextTurn = useCallback(() => {
    if (lineup.length === 0) return;
    let nextIndex = (currentTurnIndex + 1) % lineup.length;
    while (lineup[nextIndex]?.hp <= 0) {
      nextIndex = (nextIndex + 1) % lineup.length;
    }
    setCurrentTurnIndex(nextIndex);
  }, [currentTurnIndex, lineup]);

  // Setup lineup
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

  // Load a new question when it's a player's turn
  useEffect(() => {
    const current = lineup[currentTurnIndex];
    if (current && current.type === "player") {
      const q =
        additionQuestions[Math.floor(Math.random() * additionQuestions.length)];
      const shuffledOptions = shuffleArray(q.options);
      setCurrentQuestion({ ...q, options: shuffledOptions });
      setShowMoves(false);
    }
  }, [currentTurnIndex, lineup]);

  const currentParticipant = lineup[currentTurnIndex];
  const participant =
    currentParticipant?.type === "player"
      ? players.find((p) => p.id === currentParticipant.id)
      : currentParticipant?.type === "enemy"
      ? enemy
      : null;

  // Enemy turn
  useEffect(() => {
    if (gameOver) return;

    const currentParticipant = lineup[currentTurnIndex];
    if (!currentParticipant || currentParticipant.type !== "enemy") return;

    const move = enemy.moves[Math.floor(Math.random() * enemy.moves.length)];
    const alivePlayers = players.filter((p) => p.hp > 0);
    if (!alivePlayers.length) return;

    const target =
      alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
    const targetIndex = players.findIndex((p) => p.id === target.id);

    const timer = setTimeout(() => {
      setPlayers((prev) => {
        const newPlayers = [...prev];
        const damage = applyMove(move, enemy, newPlayers[targetIndex]);
        setLog([
          `${enemy.name} used ${move.name} on ${target.name} for ${damage} damage!`,
        ]);
        return newPlayers;
      });
      nextTurn();
    }, 1000);

    return () => clearTimeout(timer);
  }, [currentTurnIndex, lineup, enemy, players, gameOver, nextTurn]);

  // Player move handler
  const handlePlayerMove = (move, playerIndex) => {
    if (gameOver) return;

    setEnemy((prev) => {
      const newEnemy = { ...prev };
      const damage = applyMove(move, players[playerIndex], newEnemy);
      setLog([
        `${players[playerIndex].name} used ${move.name} for ${damage} damage!`,
      ]);
      return newEnemy;
    });

    setShowMoves(false);
    nextTurn();
  };

  // Answer handler
  const handleAnswer = (option, participant) => {
    if (gameOver) return;
    if (option.isCorrect) {
      setLog([`${participant.name} answered correctly!`]);
      setFeedback("Correct!");
      setShowMoves(true);
    } else {
      setLog([`${participant.name} answered wrong!`]);
      setFeedback(
        `Wrong! The correct answer was: ${
          currentQuestion.options.find((o) => o.isCorrect)?.text
        }`
      );
      setTimeout(() => {
        setFeedback("");
        nextTurn();
      }, 1500);
    }
  };

  return (
    <Layout>
      <h1>Dragons</h1>
      <button onClick={() => router.push("/")}>Back to Home</button>
      <button onClick={() => window.location.reload()}>Start Over</button>

      <div className={styles.gameContainer}>
        <div className={styles.topRow}>
          <div className={styles.dragonBox}>DRAGON</div>
          <div className={styles.questionArea}>
            <div className={styles.questionBox}>
              <h1>
                {enemyDead
                  ? "Victory! The enemy has been defeated!"
                  : allPlayersDead
                  ? "Defeat! All players have fallen."
                  : !showMoves
                  ? currentQuestion?.question || "Loading question..."
                  : "Select a move!"}
              </h1>
            </div>
            <div className={styles.answersGrid}>
              {participant && participant.type !== "enemy" && (
                <>
                  {showMoves
                    ? participant.moves.map((move) => (
                        <button
                          key={move.id}
                          className={styles.answerButton}
                          onClick={() =>
                            handlePlayerMove(
                              move,
                              players.findIndex((p) => p.id === participant.id)
                            )
                          }
                        >
                          {move.name}
                        </button>
                      ))
                    : currentQuestion?.options?.map((opt, i) => (
                        <button
                          key={i}
                          className={styles.answerButton}
                          onClick={() => handleAnswer(opt, participant)}
                        >
                          {opt.text}
                        </button>
                      ))}
                </>
              )}
            </div>
          </div>
        </div>

        <div className={styles.combatLog}>{log[0] && <h1>{log[0]}</h1>}</div>

        <div className={styles.lineupCarousel}>
          {Array.from({ length: 5 }).map((_, idx) => {
            if (lineup.length === 0) return null; // prevent errors when lineup not ready

            const lineupIndex = (currentTurnIndex + idx) % lineup.length; // loop around
            const participantRef = lineup[lineupIndex];

            if (!participantRef) return null; // safety check

            const participant =
              participantRef.type === "player"
                ? players.find((p) => p.id === participantRef.id)
                : enemy;

            if (!participant) return null; // safety check

            const isCurrent = idx === 0; // first card is always current

            return (
              <div
                key={participant.id}
                className={`${styles.participantCard} ${
                  isCurrent ? styles.currentParticipant : ""
                }`}
              >
                <h4>{participant.name}</h4>
                <p>
                  {participant.hp}/{participant.maxHp}
                </p>
                <div
                  style={{
                    width: "100%",
                    height: "12px",
                    background: "#444",
                    borderRadius: "5px",
                    overflow: "hidden",
                    marginTop: "5px",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.max(
                        0,
                        (participant.hp / participant.maxHp) * 100
                      )}%`,
                      height: "100%",
                      background: "#0f0",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
                {isCurrent && (
                  <p style={{ fontWeight: "bold", marginTop: "5px" }}>
                    {participantRef.type === "enemy"
                      ? "Enemy's Turn!"
                      : "Your Turn!"}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
