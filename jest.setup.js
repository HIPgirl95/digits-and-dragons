import "@testing-library/jest-dom";

jest.mock("./app/layout", () => {
  console.log("RootLayout mock applied!");
  return {
    __esModule: true,
    default: ({ children }) => <>{children}</>,
  };
});
