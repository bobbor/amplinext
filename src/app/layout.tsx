'use client';

import { Amplify } from 'aws-amplify';
import outputs from '@/amplify_outputs.json';

Amplify.configure(outputs, {
  ssr: true
});

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" style={{ minHeight: '100svh', position: 'relative' }}>
      <body style={{
        minHeight: '100svh',
        margin: 0,
        padding: 0,
        display: 'flex'
      }}>{children}</body>
    </html>
  )
}