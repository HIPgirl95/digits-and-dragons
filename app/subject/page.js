"use client";
import { useRouter } from "next/navigation";
import Layout from "../../components/layout";

export default function Subject() {
  const router = useRouter();

  return (
    <Layout>
      <h1>Choose a subject</h1>
      <p>Select a subject to test your skills:</p>
      <button onClick={() => router.push("/players")}>Next</button>
    </Layout>
  );
}
