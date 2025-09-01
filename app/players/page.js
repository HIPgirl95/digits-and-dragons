"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Layout from "../../components/layout";

export default function PlayersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const subject = searchParams.get("subject");

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Players Setup</h1>
      <p className="mb-4">Subject: {subject}</p>

      {/* Replace this with your player input logic */}
      <button
        className="px-4 py-2 bg-green-500 text-white rounded"
        onClick={() => router.push(`/game?subject=${subject}`)}
      >
        Start Game
      </button>
    </Layout>
  );
}
