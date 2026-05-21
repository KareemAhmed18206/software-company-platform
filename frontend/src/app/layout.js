import "./globals.css";
import { AuthProvider } from "../providers/auth-provider";

export const metadata = {
  title: "Software Company Platform",
  description: "Marketing site and SaaS platform for a software company."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
