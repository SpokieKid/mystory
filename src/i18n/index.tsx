'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import en from './locales/en';
import zh from './locales/zh';

// ============================================
// Types
// ============================================

export type Locale = 'en' | 'zh';

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

// ============================================
// Locale data map
// ============================================

const messages: Record<Locale, Record<string, string>> = { en, zh };

// ============================================
// Context
// ============================================

const I18nContext = createContext<I18nContextValue | null>(null);

// ============================================
// Detect browser language
// ============================================

function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'en';

  // Check localStorage first
  const stored = localStorage.getItem('locale');
  if (stored === 'en' || stored === 'zh') return stored;

  // Fall back to browser language
  const browserLang = navigator.language || '';
  if (browserLang.startsWith('zh')) return 'zh';

  return 'en';
}

// ============================================
// Provider
// ============================================

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [mounted, setMounted] = useState(false);

  // Detect on mount (client only)
  useEffect(() => {
    setLocaleState(detectLocale());
    setMounted(true);
  }, []);

  // Update html lang and persist on change
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
    localStorage.setItem('locale', locale);
  }, [locale, mounted]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let text = messages[locale][key];

      // Fall back to other locale, then to the raw key
      if (text === undefined) {
        const fallback = locale === 'en' ? 'zh' : 'en';
        text = messages[fallback][key] ?? key;
      }

      // Interpolation: replace {varName} with provided params
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        });
      }

      return text;
    },
    [locale],
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

// ============================================
// Hook
// ============================================

export function useTranslation(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return ctx;
}

// ============================================
// Language Switcher Component
// ============================================

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  const toggle = () => {
    setLocale(locale === 'en' ? 'zh' : 'en');
  };

  return (
    <button
      onClick={toggle}
      aria-label="Switch language"
      className="
        fixed top-4 right-4 z-50
        inline-flex items-center gap-1.5
        px-3 py-1.5
        text-xs font-medium tracking-wide
        rounded-full
        bg-white/[0.04] backdrop-blur-xl
        border border-white/[0.08]
        text-zinc-400
        hover:text-white hover:bg-white/[0.08] hover:border-white/[0.15]
        active:scale-95
        transition-all duration-200
        cursor-pointer
        select-none
      "
    >
      <span className="text-[13px] leading-none">
        {locale === 'en' ? 'EN' : '\u4e2d'}
      </span>
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-50"
      >
        <path d="M7 16V4m0 0L3 8m4-4l4 4" />
        <path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
      </svg>
      <span className="text-[13px] leading-none">
        {locale === 'en' ? '\u4e2d' : 'EN'}
      </span>
    </button>
  );
}
