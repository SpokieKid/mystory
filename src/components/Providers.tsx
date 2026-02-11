'use client';

import { I18nProvider, LanguageSwitcher } from '@/i18n';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <LanguageSwitcher />
      {children}
    </I18nProvider>
  );
}
