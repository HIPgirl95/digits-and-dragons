import "./globals.css";

// Metadata as a plain JS object
export const metadata = {
  title: "Digits and Dragons",
  description: "Use your math skills to defeat the dragon!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
