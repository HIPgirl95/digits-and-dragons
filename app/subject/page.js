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
      <h1 className="text-2xl font-bold mb-4">Select a Subject</h1>
      <div className="space-y-2">
        {subjects.map((subject) => (
          <label key={subject} className="block">
            <input
              type="radio"
              name="subject"
              value={subject}
              onChange={() => setSelected(subject)}
              checked={selected === subject}
              className="mr-2"
            />
            {subject}
          </label>
        ))}
      </div>

      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        disabled={!selected}
        onClick={() => router.push(`/players?subject=${selected}`)}
      >
        Next
      </button>
    </Layout>
  );
}
