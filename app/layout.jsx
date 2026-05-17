import "./globals.css";
import ClientLayout from '../components/ClientLayout';

export const metadata = {
  title: "Optivix - AI-Powered Web IDE",
  description:
    "The future of software development. AI-native self-healing coding environment.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%2300d9ff' width='100' height='100'/><text x='50' y='70' font-size='60' font-weight='bold' text-anchor='middle' fill='white'>N</text></svg>",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}

