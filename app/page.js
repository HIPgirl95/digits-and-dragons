"use client";

import Layout from "../components/layout";
import { useRouter } from "next/navigation";

export default function App() {
  const router = useRouter();

  return (
    <Layout>
      <h1>Digits and Dragons</h1>
      <p>Use your math skills to defeat the dragon!</p>
      <button onClick={() => router.push("/subject")}>Start Game</button>
    </Layout>
  );
}
