import { pool } from "../../utils/db";

export async function GET(req) {
  const url = new URL(req.url);
  const topicId = url.searchParams.get("topicId");

  if (!topicId) {
    return new Response(JSON.stringify({ error: "topicId is required" }), {
      status: 400,
    });
  }

  try {
    const result = await pool.query(
      "SELECT id, name FROM subtopics WHERE topic_id = $1 ORDER BY name",
      [topicId]
    );
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
    });
  }
}
