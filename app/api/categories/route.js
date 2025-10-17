import { pool } from "../../utils/db";

export async function GET(req) {
  const url = new URL(req.url);
  const subjectId = url.searchParams.get("subjectId");

  if (!subjectId) {
    return new Response(JSON.stringify({ error: "subjectId is required" }), {
      status: 400,
    });
  }

  try {
    const result = await pool.query(
      "SELECT id, name FROM categories WHERE subject_id = $1 ORDER BY name",
      [subjectId]
    );
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
    });
  }
}
