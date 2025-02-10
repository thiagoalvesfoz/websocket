import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ChatProvider } from './context/chat.context';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Chat',
  description: 'Chat criado para fins de pesquisa com conversas temporárias.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ChatProvider>
          <div className="text-gray-700 bg-gray-300 flex flex-col items-center justify-center min-h-dvh max-h-dvh p-0 lg:p-8 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            {children}
          </div>
        </ChatProvider>
      </body>
    </html>
  );
}
