import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { FirebaseProvider } from "../context/FirebaseContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SEA Catering - Healthy Meals, Anytime, Anywhere",
  description: "Customizable healthy meal delivery across Indonesia.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FirebaseProvider>
          <Navbar />
          {children}
        </FirebaseProvider>
      </body>
    </html>
  );
}
