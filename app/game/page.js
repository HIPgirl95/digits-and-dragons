"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Layout from "../../components/layout";
import { enemies } from "../data/enemies";
import { applyMove } from "../utils/combat";
import styles from "./game.module.css";
import { useGame } from "../context/gameContext";
import Image from "next/image";

export default function Game() {
  const router = useRouter();
  const {
    subjects,
    subtopics: selectedSubtopics,
    players: contextPlayers,
  } = useGame();

  const [questionBank, setQuestionBank] = useState([]);
  const [players, setPlayers] = useState([]);
  const [enemy, setEnemy] = useState({ ...enemies[0], hp: enemies[0].maxHp });
  const [lineup, setLineup] = useState([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showMoves, setShowMoves] = useState(false);
  const [log, setLog] = useState([]);
  const [feedback, setFeedback] = useState("");

  const allPlayersDead = players.every((p) => p.hp <= 0);
  const enemyDead = enemy.hp <= 0;
  const gameOver = allPlayersDead || enemyDead;

  // Shuffle utility
  const shuffleArray = (arr) =>
    Array.isArray(arr) ? [...arr].sort(() => Math.random() - 0.5) : [];

  // --- 1. Fetch questions ---
  useEffect(() => {
    if (!selectedSubtopics?.length) return;

    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // Make sure this is an array of IDs
            subtopicIds: selectedSubtopics,
          }),
        });
        const data = await res.json();
        console.log("Fetched questions:", data);
        setQuestionBank(data || []);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
      }
    };

    fetchQuestions();
  }, [selectedSubtopics]);

  // --- 2. Initialize players ---
  useEffect(() => {
    if (!contextPlayers?.length) return;

    const initializedPlayers = contextPlayers.map((p, i) => ({
      id: i + 1,
      name: p.name,
      class: p.class,
      moves: p.class?.moves || [],
      hp: p.class?.maxHp || 100,
      maxHp: p.class?.maxHp || 100,
      type: "player",
    }));

    setPlayers(initializedPlayers);
  }, [contextPlayers]);

  // --- 3. Initialize lineup ---
  useEffect(() => {
    if (!players.length || !enemy) return;
    if (lineup.length) return;

    setLineup(shuffleArray([...players, { ...enemy, type: "enemy" }]));
  }, [players, enemy, lineup]);

  const currentParticipant = lineup[currentTurnIndex];

  // --- 4. Load question on player's turn ---
  useEffect(() => {
    if (currentParticipant?.type !== "player") return;
    if (!questionBank.length) return;

    const q = questionBank[Math.floor(Math.random() * questionBank.length)];
    const shuffledOptions = shuffleArray(q.options || []);
    setCurrentQuestion({ ...q, options: shuffledOptions });
    setShowMoves(false);
    setFeedback("");
  }, [currentTurnIndex, currentParticipant, questionBank]);

  // --- 5. Advance turn ---
  const nextTurn = useCallback(() => {
    if (!lineup.length) return;

    let nextIndex = (currentTurnIndex + 1) % lineup.length;
    let attempts = 0;

    while (lineup[nextIndex]?.hp <= 0 && attempts < lineup.length) {
      nextIndex = (nextIndex + 1) % lineup.length;
      attempts++;
    }

    setCurrentTurnIndex(nextIndex);
  }, [currentTurnIndex, lineup]);

  // --- 6. Enemy turn ---
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

  // --- 7. Player move after correct answer ---
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

  // --- 8. Player answers question ---
  const handleAnswer = (option, participant) => {
    if (gameOver || !option) return;

    if (option.isCorrect) {
      setLog([`${participant.name} answered correctly!`]);
      setShowMoves(true);
    } else {
      const correct = currentQuestion?.options?.find((o) => o.isCorrect)?.text;
      setLog([`${participant.name} answered wrong!`]);
      setFeedback(`Wrong! Correct answer: ${correct}`);
      setTimeout(() => {
        setFeedback("");
        nextTurn();
      }, 1500);
    }
  };

  const participant =
    currentParticipant?.type === "player"
      ? players.find((p) => p.id === currentParticipant.id)
      : currentParticipant?.type === "enemy"
      ? enemy
      : null;
  console.log("selectedSubtopics:", selectedSubtopics);

  return (
    <Layout>
      <h1>Dragons</h1>
      <p>Subjects: {subjects.join(", ")}</p>
      <button onClick={() => router.push("/")}>Back to Home</button>

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
                  : participant?.type === "player" && !showMoves
                  ? currentQuestion?.question || "Loading question..."
                  : "Select a move!"}
              </h1>
              {feedback && <p>{feedback}</p>}
            </div>

            <div className={styles.answersGrid}>
              {participant?.type === "player" && !gameOver && (
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
            if (!lineup.length) return null;

            const lineupIndex = (currentTurnIndex + idx) % lineup.length;
            const participantRef = lineup[lineupIndex];
            if (!participantRef) return null;

            const p =
              participantRef.type === "player"
                ? players.find((pl) => pl.id === participantRef.id)
                : enemy;

            if (!p) return null;

            const isCurrent = idx === 0;

            return (
              <div
                key={`${participantRef.type}-${p.id}`}
                className={`${styles.participantCard} ${
                  isCurrent ? styles.currentParticipant : ""
                }`}
              >
                {p.class?.image && (
                  <Image
                    src={p.class.image}
                    alt={p.class.name}
                    width={50}
                    height={50}
                    style={{ borderRadius: "50%" }}
                  />
                )}
                <h4>{p.name}</h4>
                <p className={styles.className}>{p.class?.name}</p>
                <p>
                  {p.hp}/{p.maxHp}
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
                      width: `${Math.max(0, (p.hp / p.maxHp) * 100)}%`,
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
