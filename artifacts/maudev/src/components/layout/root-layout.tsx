import { ReactNode } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground font-sans">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
