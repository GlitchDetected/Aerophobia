import '../styles/globals.css';

// Remove viewport from metadata
export const metadata = {
  title: 'Aerophobia',
  description: 'Aerophobia or Aero is an economy bot',
  og: {
    title: 'Aerophobia',
    type: 'website',
    description: 'A comprehensive tool for logging your information',
  },
};

// Export the viewport as a separate export
export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content={metadata.author} />
        <meta name="theme-color" content="#6200ea" />
        <title>{metadata.title}</title>

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={metadata.og.title} />
        <meta property="og:type" content={metadata.og.type} />
        <meta property="og:url" content={metadata.og.url} />
        <meta property="og:image" content={metadata.og.image} />
        <meta property="og:description" content={metadata.og.description} />

      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
