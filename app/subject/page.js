"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "../../components/layout";

export default function SubjectSelection({
  subjects = ["Addition", "Subtraction"],
}) {
  const [selected, setSelected] = useState("");
  const router = useRouter();

  return (
    <Layout>
      <h1>Select a Subject</h1>
      {subjects.map((subject) => (
        <label key={subject}>
          <input
            type="radio"
            name="subject"
            value={subject}
            onChange={() => setSelected(subject)}
          />
          {subject}
        </label>
      ))}

      <button disabled={!selected} onClick={() => router.push("/players")}>
        Next
      </button>
    </Layout>
  );
}
