import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";

import Subject from "../app/subject/page";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../app/layout", () => ({
  __esModule: true,
  default: ({ children }) => <>{children}</>,
}));

describe("Subject Selection Page", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    pushMock.mockReset();
    useRouter.mockReturnValue({ push: pushMock });
    render(<Subject />);
  });

  test("displays the heading", () => {
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Select a Subject"
    );
  });

  test("disables Next button until a subject is selected", async () => {
    const nextButton = screen.getByRole("button", { name: /Next/i });
    expect(nextButton).toBeDisabled();

    const additionOption = screen.getByRole("radio", { name: /Addition/i });
    await userEvent.click(additionOption);

    expect(nextButton).toBeEnabled();
  });

  test("navigates to the next page after selecting a subject", async () => {
    const nextButton = screen.getByRole("button", { name: /Next/i });
    const additionOption = screen.getByRole("radio", { name: /addition/i });
    await userEvent.click(additionOption);
    await userEvent.click(nextButton);

    expect(pushMock).toHaveBeenCalledWith("/players"); // whatever route is next
  });
});
