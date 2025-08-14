import Link from "next/link";
import Layout from "../components/layout";

export default function App() {
  return (
    <Layout>
      <h1>Digits and Dragons</h1>
      <p>Use your math skills to defeat the dragon!</p>
      <Link href="/subject">
        <button>Start Game</button>
      </Link>
    </Layout>
  );
}
