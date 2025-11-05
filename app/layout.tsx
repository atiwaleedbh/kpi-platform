import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KPI Platform - Manufacturing Excellence',
  description: 'Enterprise KPI Management Platform for Manufacturing and Operations',
  keywords: ['KPI', 'manufacturing', 'OEE', 'lean', 'dashboard', 'analytics'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
