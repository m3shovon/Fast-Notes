// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Standard Favicon */}
        <link rel="icon" href="/assets/images/favicon.ico" />

        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" sizes="180x180" href="../assets/images/QuickNotes.png" />

        {/* Android Icons */}
        <link rel="icon" type="image/png" sizes="192x192" href="../assets/images/QuickNotes.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="../assets/images/QuickNotes.png" />

        {/* Safari Pinned Tab */}
        <link rel="mask-icon" href="../assets/images/QuickNotes.png" color="#5bbad5" />

        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#0f172a" />

        {/* Optional manifest for PWA
        <link rel="manifest" href="/manifest.json" /> */}
      </Head>
      <body className="bg-background text-foreground">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
