"use client";

import { createContext, useContext, useState } from "react";

const GameContext = createContext();

export function GameProvider({ children }) {
  const [subjects, setSubjects] = useState([]); // initialize as empty array
  const [subtopics, setSubtopics] = useState([]); // initialize as empty array
  const [players, setPlayers] = useState([]); // [{ name: "", class: { name: "", image: "" } }]

  return (
    <GameContext.Provider
      value={{
        subtopics,
        setSubtopics,
        subjects,
        setSubjects,
        players,
        setPlayers,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
