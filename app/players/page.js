import Link from "next/link";
import Layout from "../../components/layout";

export default function Players() {
  return (
    <Layout>
      <h1>Select your Character</h1>
      <p>Use your math skills to defeat the dragon!</p>
      <Link href="/game">
        <button>Begin!</button>
      </Link>
    </Layout>
  );
}
