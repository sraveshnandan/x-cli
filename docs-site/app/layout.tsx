import { RootProvider } from 'fumadocs-ui/provider/next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import type { ReactNode } from 'react';
import './global.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const martianMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-martian-mono',
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${martianMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
