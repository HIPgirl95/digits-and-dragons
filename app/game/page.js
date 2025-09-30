"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Layout from "../../components/layout";
import { enemies } from "../data/enemies";
import { additionQuestions } from "../data/math/addition";
import { subtractionQuestions } from "../data/math/subtraction";
import { multiplicationQuestions } from "../data/math/multiplication";
import { divisionQuestions } from "../data/math/division";
import { applyMove } from "../utils/combat";
import styles from "./game.module.css";
import { useGame } from "../context/gameContext";
import Image from "next/image";

export default function Game() {
  const router = useRouter();
  const { subjects, players: contextPlayers } = useGame(); // use players from context

  // Combine question banks
  const questionBank = useMemo(() => {
    let combined = [];
    subjects.forEach((subject) => {
      if (subject === "Addition") combined = combined.concat(additionQuestions);
      if (subject === "Subtraction")
        combined = combined.concat(subtractionQuestions);
      if (subject === "Multiplication")
        combined = combined.concat(multiplicationQuestions);
      if (subject === "Division") combined = combined.concat(divisionQuestions);
    });
    return combined;
  }, [subjects]);

  // Initialize players with hp + id
  const [players, setPlayers] = useState(
    contextPlayers.map((p, i) => ({
      id: i + 1,
      name: p.name,
      class: p.class,
      moves: p.class.moves || [], // fallback if moves are stored in class data
      hp: p.class.maxHp || 100, // fallback if class has maxHp
      maxHp: p.class.maxHp || 100,
    }))
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

  // Load a new question on player's turn
  useEffect(() => {
    const current = lineup[currentTurnIndex];
    if (current && current.type === "player" && questionBank.length > 0) {
      const q = questionBank[Math.floor(Math.random() * questionBank.length)];
      const shuffledOptions = shuffleArray(q.options);
      setCurrentQuestion({ ...q, options: shuffledOptions });
      setShowMoves(false);
    }
  }, [currentTurnIndex, lineup, questionBank]);

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
  }, [currentParticipant, enemy, players, gameOver, nextTurn]);

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
      <p>Subjects: {subjects.join(", ")}</p>
      <button onClick={() => router.push("/")}>Back to Home</button>
      {/* <button onClick={() => window.location.reload()}>Start Over</button> */}

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
              {participant && participant.type !== "enemy" && !gameOver && (
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
          {Array.from({ length: Math.min(lineup.length, 5) }).map((_, idx) => {
            if (lineup.length === 0) return null;

            const lineupIndex = (currentTurnIndex + idx) % lineup.length;
            const participantRef = lineup[lineupIndex];
            if (!participantRef) return null;

            const participant =
              participantRef.type === "player"
                ? players.find((p) => p.id === participantRef.id)
                : enemy;

            if (!participant) return null;

            const isCurrent = idx === 0;

            return (
              <div
                key={`${participantRef.type}-${participant.id}`}
                className={`${styles.participantCard} ${
                  isCurrent ? styles.currentParticipant : ""
                }`}
              >
                {/* Show class image if available */}
                {participant.class?.image && (
                  <Image
                    src={participant.class.image}
                    alt={participant.class.name}
                    width={50}
                    height={50}
                    style={{ borderRadius: "50%" }}
                  />
                )}
                <h4>{participant.name}</h4>
                <p className={styles.className}>{participant.class?.name}</p>
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
                {isCurrent && !gameOver && (
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
