"use client";
import { useRouter } from "next/navigation";
import Layout from "../../components/layout";

export default function Game() {
  const router = useRouter();

  return (
    <Layout>
      <h1>Dragons</h1>
      <button onClick={() => router.push("/")}>Start Over</button>
    </Layout>
  );
}
