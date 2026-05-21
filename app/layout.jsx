import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import "./globals.css";
import ClientLayout from '../components/ClientLayout';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata = {
  title: "Optivix - AI-Powered Web IDE",
  description:
    "The future of software development. AI-native self-healing coding environment.",
  icons: {
    icon: [
      { url: "/brand/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/brand/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/logo-icon.svg", type: "image/svg+xml" },
    ],
    apple: "/brand/apple-touch-icon.png",
    shortcut: "/brand/favicon-32x32.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-background text-foreground font-display antialiased">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}

