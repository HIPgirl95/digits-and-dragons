"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGame } from "../context/gameContext";
import Layout from "../../components/layout";

export default function SubjectPage() {
  const router = useRouter();
  const { setSubtopics: setGameSubtopics, setSubjects: setGameSubjects } =
    useGame();

  const [subjectsData, setSubjectsData] = useState([]);
  const [selectedSubtopics, setSelectedSubtopics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch subjects/categories/subtopics
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch("/api/fields");
        if (!res.ok) throw new Error("Failed to fetch subjects");
        const data = await res.json();

        // Ensure we have an array
        setSubjectsData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setSubjectsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  // Toggle individual subtopic
  const toggleSubtopic = (subtopicId) => {
    setSelectedSubtopics((prev) =>
      prev.includes(subtopicId)
        ? prev.filter((id) => id !== subtopicId)
        : [...prev, subtopicId]
    );
  };

  // Select or deselect all subtopics in a category
  const toggleCategory = (category) => {
    const subIds = category.subtopics.map((s) => s.id);
    const allSelected = subIds.every((id) => selectedSubtopics.includes(id));

    setSelectedSubtopics((prev) => {
      if (allSelected) {
        // Deselect all
        return prev.filter((id) => !subIds.includes(id));
      } else {
        // Add missing subtopics
        return [...new Set([...prev, ...subIds])];
      }
    });
  };

  const selectedSubjects = subjectsData
    .filter((subject) =>
      subject.categories.some((category) =>
        category.subtopics.some((sub) => selectedSubtopics.includes(sub.id))
      )
    )
    .map((subject) => subject.name);

  const isCategorySelected = (category) =>
    category.subtopics.every((s) => selectedSubtopics.includes(s.id));

  const handleNext = () => {
    setGameSubtopics(selectedSubtopics);
    setGameSubjects(selectedSubjects);
    router.push("/players");
  };

  console.log("Selected Subtopics:", selectedSubtopics);
  console.log("Selected Subjects:", selectedSubjects);

  return (
    <Layout>
      <div style={{ padding: "20px" }}>
        <h1>Select Topics</h1>
        <p>
          Pick any combination of topics. Selecting a category selects all its
          subtopics.
        </p>

        {(subjectsData || []).map((subject) => (
          <div key={subject.id} style={{ marginBottom: "20px" }}>
            <h2>{subject.name}</h2>
            {subject.categories.map((category) => (
              <div
                key={category.id}
                style={{ marginLeft: "20px", marginBottom: "10px" }}
              >
                <label>
                  <input
                    type="checkbox"
                    checked={isCategorySelected(category)}
                    onChange={() => toggleCategory(category)}
                  />
                  <strong>{category.name}</strong>
                </label>

                <div style={{ marginLeft: "20px" }}>
                  {category.subtopics.map((sub) => (
                    <div key={sub.id}>
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedSubtopics.includes(sub.id)}
                          onChange={() => toggleSubtopic(sub.id)}
                        />
                        {sub.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}

        <button
          disabled={selectedSubtopics.length === 0}
          onClick={handleNext}
          style={{ marginTop: "20px" }}
        >
          Next
        </button>
      </div>
    </Layout>
  );
}
