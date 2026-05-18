import AuthForm from '@/components/AuthForm'

export const metadata = {
  title: 'Login & Register - Optivix AI-Powered Web IDE',
  description: 'Sign in to Optivix, the AI-native web IDE. Create your account to access intelligent code assistance, real-time bug detection, self-healing features, and collaborative development tools.',
  keywords: 'optivix login, web ide authentication, developer account, code editor signup, ai coding platform, developer tools login',
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
    canonical: '/auth',
  },
  openGraph: {
    title: 'Login & Register - Optivix AI-Powered Web IDE',
    description: 'Sign in to Optivix, the AI-native web IDE. Create your account to access intelligent code assistance, real-time bug detection, self-healing features, and collaborative development tools.',
    type: 'website',
    url: 'https://optivix.vercel.app/auth',
    siteName: 'Optivix',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Login & Register - Optivix AI-Powered Web IDE',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Login & Register - Optivix AI-Powered Web IDE',
    description: 'Sign in to Optivix, the AI-native web IDE. Create your account to access intelligent code assistance, real-time bug detection, self-healing features, and collaborative development tools.',
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

export default function AuthPage() {
  return <AuthForm />
}












