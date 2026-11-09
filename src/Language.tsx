import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { english } from './translations';
export type Language = 'sv' | 'en';
const LanguageContext = createContext<{ language: Language; setLanguage: (language: Language) => void; t: (text: string) => string }>({ language: 'sv', setLanguage: () => {}, t: text => text });
function initialLanguage(): Language {
  const param = new URLSearchParams(window.location.search).get('lang');
  if (param === 'en' || param === 'sv') return param;
  return 'sv';
}
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const t = useCallback((text: string) => language === 'en' ? text.replace(text.trim(), english[text.trim()] ?? text.trim()) : text, [language]);
  useEffect(() => {
    document.documentElement.lang = language;
    const url = new URL(window.location.href);
    if (language === 'en') url.searchParams.set('lang', 'en');
    else url.searchParams.delete('lang');
    window.history.replaceState(null, '', url);
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute('content', language === 'en'
      ? 'Vivra Health offers preventive cardiovascular care with blood tests, heart scans and a personal prevention plan.'
      : 'Vivra Health erbjuder förebyggande hjärt-kärlvård med blodprover, hjärtskanning och en personlig plan för prevention.');
  }, [language]);
  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}
export function useLanguage() { return useContext(LanguageContext); }
