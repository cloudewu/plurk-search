import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plurk Search',
  description: 'A specialized search engine for personal plurk contents.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
