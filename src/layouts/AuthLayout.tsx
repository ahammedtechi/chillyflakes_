import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '../components/Logo';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#223B28] flex flex-col font-sans selection:bg-[#2E4D34] selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAE5DB]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo linking to Home */}
          <Link
            to="/"
            className="flex items-center gap-2 group transition-opacity hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#2E4D34] rounded-lg p-1"
            aria-label="ChillyFlakes Home"
          >
            <Logo variant="dark" size="md" showTagline={true} />
          </Link>

          {/* Right Header Actions: Back to Store + Language Switcher */}
          <div className="flex items-center gap-3 sm:gap-5">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#5F6D61] hover:text-[#2E4D34] transition-colors py-1.5 px-3 rounded-full hover:bg-white border border-transparent hover:border-[#EAE5DB]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('nav.backToStore')}</span>
            </Link>

            <LanguageSwitcher variant="light" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
        <div className="w-full max-w-[1200px] mx-auto flex-grow flex flex-col items-center justify-center">
          {children}
        </div>
      </main>

      {/* Minimal Auth Footer */}
      <footer className="border-t border-[#EAE5DB] bg-white py-6">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#637365]">
          <p className="text-center sm:text-left">{t('footer.rights')}</p>

          <div className="flex items-center gap-6">
            <Link to="/terms" className="hover:text-[#2E4D34] transition-colors hover:underline">
              {t('footer.terms')}
            </Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-[#2E4D34] transition-colors hover:underline">
              {t('footer.privacy')}
            </Link>
            <span>•</span>
            <a
              href="mailto:sellers@chillyflakes.in"
              className="hover:text-[#2E4D34] transition-colors hover:underline"
            >
              {t('footer.help')}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default AuthLayout;
