"use client";

import { useRouter } from "next/navigation";
import Layout from "../../components/layout";

export default function Players() {
  const router = useRouter();

  return (
    <Layout>
      <h1>Select your Character</h1>
      <p>Use your math skills to defeat the dragon!</p>
      <button onClick={() => router.push("/game")}>Begin!</button>
    </Layout>
  );
}
