import IDEContent from '@/components/IDEContent'

export const metadata = {
  title: 'IDE - Optivix AI-Powered Code Editor | Real-time Analysis',
  description: 'Experience the future of coding with Optivix IDE. AI-native code editor featuring real-time bug detection, intelligent code suggestions, self-healing capabilities, and advanced debugging tools.',
  keywords: 'ai code editor, web ide, intelligent coding, real-time analysis, code assistant, ai debugging, smart code completion',
  authors: [{ name: 'Optivix Team' }],
  creator: 'Optivix',
  publisher: 'Optivix',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://optivix.vercel.app'),
  alternates: {
    canonical: '/ide',
  },
  openGraph: {
    title: 'IDE - Optivix AI-Powered Code Editor | Real-time Analysis',
    description: 'Experience the future of coding with Optivix IDE. AI-native code editor featuring real-time bug detection, intelligent code suggestions, self-healing capabilities, and advanced debugging tools.',
    type: 'website',
    url: 'https://optivix.vercel.app/ide',
    siteName: 'Optivix',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'IDE - Optivix AI-Powered Code Editor | Real-time Analysis',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IDE - Optivix AI-Powered Code Editor | Real-time Analysis',
    description: 'Experience the future of coding with Optivix IDE. AI-native code editor featuring real-time bug detection, intelligent code suggestions, self-healing capabilities, and advanced debugging tools.',
    creator: '@optivix',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
}

export default function Page() {
  return <IDEContent />
}
