import { query } from "../../utils/db";

export async function GET() {
  try {
    const result = await query("SELECT NOW()");
    return new Response(JSON.stringify(result.rows[0]), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("Database error", { status: 500 });
  }
}
