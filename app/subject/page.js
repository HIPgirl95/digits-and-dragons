"use client";

import { useRouter } from "next/navigation";
import Layout from "../../components/layout";
import { useGame } from "../context/gameContext";

export default function SubjectSelection({
  subjects = ["Addition", "Subtraction", "Multiplication"],
}) {
  const router = useRouter();
  const { subjects: selectedSubjects, setSubjects } = useGame();

  const toggleSubject = (subject) => {
    if (selectedSubjects.includes(subject)) {
      setSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      setSubjects([...selectedSubjects, subject]);
    }
  };

  return (
    <Layout>
      <h1>Select Subjects</h1>
      {subjects.map((s) => (
        <label key={s}>
          <input
            type="checkbox"
            name="subject"
            value={s}
            checked={selectedSubjects.includes(s)}
            onChange={() => toggleSubject(s)}
          />
          {s}
        </label>
      ))}

      <button
        disabled={selectedSubjects.length === 0}
        onClick={() => router.push("/players")}
      >
        Next
      </button>
    </Layout>
  );
}
