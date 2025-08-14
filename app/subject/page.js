import Link from "next/link";
import Layout from "../../components/layout";

export default function Subject() {
  return (
    <Layout>
      <h1>Choose a subject</h1>
      <p>Select a subject to test your skills:</p>
      <button>
        <Link href="/players">Next</Link>
      </button>
    </Layout>
  );
}
