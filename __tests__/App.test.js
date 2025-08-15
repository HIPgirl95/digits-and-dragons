import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";

import App from "../app/page";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// ✅ Mock the layout so it doesn't return <html> and <body>
jest.mock("../app/layout", () => ({
  __esModule: true,
  default: ({ children }) => <>{children}</>,
}));

describe("Start Page", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    // Reset mock before each test
    pushMock.mockReset();
    useRouter.mockReturnValue({ push: pushMock });
    // Render the App component
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

  test("navigates to subject select screen on start button click", async () => {
    const button = screen.getByRole("button", { name: /Start Game/i });
    await userEvent.click(button);

    // Check that router.push was called with the correct path
    expect(pushMock).toHaveBeenCalledWith("/subject");
  });
});

// This test suite checks the functionality of the start page in the Digits and Dragons game application
// It verifies that the title, description, and start button are displayed correctly
// It also checks that clicking the start button navigates to the game page
