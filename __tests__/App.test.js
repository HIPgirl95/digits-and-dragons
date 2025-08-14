import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../app/page";

describe("Start Page", () => {
  beforeEach(() => {
    render(<App />);
  });

  test("displays the title", () => {
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Digits and Dragons"
    );
  });

  test("displays the description", () => {
    expect(
      screen.getByText(/Use your math skills to defeat the dragon!/i)
    ).toBeInTheDocument();
  });

  test("displays the start button", () => {
    expect(
      screen.getByRole("button", { name: /Start Game/i })
    ).toBeInTheDocument();
  });

  test("navigates to game page on start button click", async () => {
    const button = screen.getByRole("button", { name: /Start Game/i });
    await userEvent.click(button);
    // Replace this with an assertion that confirms you're on the game page
    expect(screen.getByText(/Game Page/i)).toBeInTheDocument();
  });
});

// This test suite checks the functionality of the start page in the Digits and Dragons game application
// It verifies that the title, description, and start button are displayed correctly
// It also checks that clicking the start button navigates to the game page
