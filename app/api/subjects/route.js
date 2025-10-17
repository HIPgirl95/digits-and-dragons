import { pool } from "../../utils/db";

export async function GET(req) {
  const url = new URL(req.url);
  const fieldId = url.searchParams.get("fieldId");

  if (!fieldId) {
    return new Response(JSON.stringify({ error: "fieldId is required" }), {
      status: 400,
    });
  }

  try {
    const result = await pool.query(
      "SELECT id, name FROM subjects WHERE field_id = $1 ORDER BY name",
      [fieldId]
    );
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
    });
  }
}
