import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag, Sparkles } from "lucide-react";
import { cn } from "@/components/utils";

export const metadata: Metadata = {
  title: "Подарочные пакеты — каталог",
  description: "Каталог подарочных пакетов (розница и опт).",
};

function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white">
            <ShoppingBag className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold">Подарочные пакеты</div>
            <div className="text-xs text-zinc-500">розница • опт</div>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/catalog"
            className={cn(
              "rounded-xl px-3 py-2 text-sm font-medium",
              "hover:bg-zinc-100 active:bg-zinc-200"
            )}
          >
            Каталог
          </Link>
          <Link
            href="/wholesale"
            className={cn(
              "rounded-xl px-3 py-2 text-sm font-medium",
              "hover:bg-zinc-100 active:bg-zinc-200"
            )}
          >
            Опт
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-200">
      <div className="container py-10 text-sm text-zinc-500">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            © {new Date().getFullYear()} • Каталог подарочных пакетов
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>Сделано на Next.js (статический экспорт)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <TopNav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
