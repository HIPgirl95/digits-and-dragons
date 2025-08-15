import "@testing-library/jest-dom";
import React from "react";
import fetchMock from "jest-fetch-mock";

// Enable fetch mocks
fetchMock.enableMocks();

// Mock RootLayout
jest.mock("./app/layout", () => ({
  __esModule: true,
  default: ({ children }) => <>{children}</>,
}));

// Reset mocks after each test
beforeEach(() => {
  fetchMock.resetMocks();
});
