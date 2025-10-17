// app/api/questions/route.js
import { NextResponse } from "next/server";
import { query } from "../../utils/db";

export async function POST(req) {
  try {
    const { subtopicIds } = await req.json(); // array of subtopic IDs
    if (!subtopicIds || !subtopicIds.length)
      return NextResponse.json([], { status: 200 });

    const res = await query(
      `SELECT * FROM questions WHERE subtopic_id = ANY($1::int[])`,
      [subtopicIds]
    );

    // Assuming questions table has 'options' as JSON
    const questions = res.rows.map((q) => ({
      ...q,
      question: q.question_text,
      options: q.options,
    }));

    return NextResponse.json(questions);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}
