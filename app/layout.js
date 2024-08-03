// app/layout.js
import { Analytics } from '@vercel/analytics/react';
import './globals.css'; // Import your global CSS

export const metadata = {
  title: "Shelf Smart",
  description: "Effortlessly manage your pantry with Shelf Smart. Track, add, and organize your items with a user-friendly interface designed to simplify your life."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>My Next.js App</title>
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
