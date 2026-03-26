import { createContext, useContext, useState } from "react";

export type Language = "pt" | "en" | "es";

export const translations: Record<Language, Record<string, string>> = {
  pt: {
    dashboard: "Dashboard",
    agenda: "Agenda",
    patients: "Pacientes",
    records: "Prontuários",
    financial: "Financeiro",
    chat: "Chat",
    marketing: "Marketing",
    reports: "Relatórios",
    settings: "Configurações",
    main: "Principal",
    management: "Gestão",
    darkMode: "Modo escuro",
    language: "Idioma",
    nutritionist: "Nutricionista",
    nutritionManagement: "Gestão Nutricional",
  },
  en: {
    dashboard: "Dashboard",
    agenda: "Schedule",
    patients: "Patients",
    records: "Records",
    financial: "Financial",
    chat: "Chat",
    marketing: "Marketing",
    reports: "Reports",
    settings: "Settings",
    main: "Main",
    management: "Management",
    darkMode: "Dark mode",
    language: "Language",
    nutritionist: "Nutritionist",
    nutritionManagement: "Nutrition Management",
  },
  es: {
    dashboard: "Panel",
    agenda: "Agenda",
    patients: "Pacientes",
    records: "Historiales",
    financial: "Financiero",
    chat: "Chat",
    marketing: "Marketing",
    reports: "Informes",
    settings: "Configuración",
    main: "Principal",
    management: "Gestión",
    darkMode: "Modo oscuro",
    language: "Idioma",
    nutritionist: "Nutricionista",
    nutritionManagement: "Gestión Nutricional",
  },
};

const languageLabels: Record<Language, string> = { pt: "Português", en: "English", es: "Español" };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  languageLabel: string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "pt",
  setLanguage: () => {},
  t: (key) => key,
  languageLabel: "Português",
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLang] = useState<Language>(() => {
    const stored = localStorage.getItem("app-language");
    return (stored as Language) || "pt";
  });

  const setLanguage = (lang: Language) => {
    setLang(lang);
    localStorage.setItem("app-language", lang);
  };

  const t = (key: string) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languageLabel: languageLabels[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
export const languages: { value: Language; label: string }[] = [
  { value: "pt", label: "Português" },
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
];
