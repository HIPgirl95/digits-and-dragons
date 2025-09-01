"use client";

import { useRouter } from "next/navigation";
import Layout from "../../components/layout";
import { useGame } from "../context/gameContext";

export default function PlayersPage() {
  const router = useRouter();
  const { subjects } = useGame(); // get selected subjects from context

  if (!subjects || subjects.length === 0) {
    return (
      <Layout>
        <h1>No subjects selected!</h1>
        <button
          onClick={() => router.push("/subjects")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Back to Subject Selection
        </button>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Players Setup</h1>
      <p className="mb-4">Subjects: {subjects.join(", ")}</p>

      {/* Replace this with your player input logic */}
      <button
        className="px-4 py-2 bg-green-500 text-white rounded"
        onClick={() => router.push("/game")}
      >
        Start Game
      </button>
    </Layout>
  );
}
