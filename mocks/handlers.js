import { rest } from "msw";

export const handlers = [
  rest.get("/api/questions", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, question: "2 + 2 = ?", choices: ["3", "4"], answer: "4" },
      ])
    );
  }),
];
