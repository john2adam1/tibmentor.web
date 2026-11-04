import type { Metadata } from 'next';
import './globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import { LanguageProvider } from '@/lib/language-context';
import ToastProvider from '@/components/common/ToastProvider';
import { BRAND_DESCRIPTION, BRAND_TITLE } from '@/lib/brand';

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: BRAND_TITLE,
  description: BRAND_DESCRIPTION,
  icons: {
    icon: '/assets/logo-icon.png',
    apple: '/assets/logo-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <body className={`${fontSans.variable} min-h-screen flex flex-col font-sans`}>
        <AuthProvider>
          <LanguageProvider>
            <ToastProvider />
            {children}
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
