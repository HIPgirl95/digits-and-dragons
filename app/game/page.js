import Link from "next/link";
import Layout from "../../components/layout";

export default function Game() {
  return (
    <Layout>
      <h1>Dragons</h1>
      <button>
        <Link href="/">Start over</Link>
      </button>
    </Layout>
  );
}
