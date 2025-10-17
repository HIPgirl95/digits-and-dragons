import { pool } from "@/utils/db";

export async function GET(req) {
  const url = new URL(req.url);
  const categoryId = url.searchParams.get("categoryId");

  if (!categoryId) {
    return new Response(JSON.stringify({ error: "categoryId is required" }), {
      status: 400,
    });
  }

  try {
    const result = await pool.query(
      "SELECT id, name FROM topics WHERE category_id = $1 ORDER BY name",
      [categoryId]
    );
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
    });
  }
}
