import { NextResponse } from "next/server";
import { pool } from "../../utils/db"; // your db connection

export async function GET() {
  try {
    const subjectsRes = await pool.query("SELECT * FROM subjects ORDER BY id");
    const subjects = [];

    for (const subject of subjectsRes.rows) {
      // Get categories for this subject
      const categoriesRes = await pool.query(
        "SELECT * FROM categories WHERE subject_id = $1 ORDER BY id",
        [subject.id]
      );

      const categories = [];

      for (const category of categoriesRes.rows) {
        // Get subtopics for this category
        const subtopicsRes = await pool.query(
          "SELECT * FROM subtopics WHERE category_id = $1 ORDER BY id",
          [category.id]
        );

        categories.push({
          ...category,
          subtopics: subtopicsRes.rows,
        });
      }

      subjects.push({
        ...subject,
        categories,
      });
    }

    return NextResponse.json(subjects);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
}
