import PaymentContent from '@/components/PaymentContent'

export const metadata = {
  title: 'Pricing & Plans - Optivix | Choose Your Perfect Plan',
  description: 'Explore Optivix pricing plans. Start free with unlimited projects. Upgrade to Pro for advanced AI analysis, priority support, team collaboration, and enterprise features.',
  keywords: 'optivix pricing, web ide plans, developer tools pricing, code editor subscription, ai coding platform cost',
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
    canonical: '/payment',
  },
  openGraph: {
    title: 'Pricing & Plans - Optivix | Choose Your Perfect Plan',
    description: 'Explore Optivix pricing plans. Start free with unlimited projects. Upgrade to Pro for advanced AI analysis, priority support, team collaboration, and enterprise features.',
    type: 'website',
    url: 'https://optivix.vercel.app/payment',
    siteName: 'Optivix',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Pricing & Plans - Optivix | Choose Your Perfect Plan',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing & Plans - Optivix | Choose Your Perfect Plan',
    description: 'Explore Optivix pricing plans. Start free with unlimited projects. Upgrade to Pro for advanced AI analysis, priority support, team collaboration, and enterprise features.',
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
  return <PaymentContent />
}
