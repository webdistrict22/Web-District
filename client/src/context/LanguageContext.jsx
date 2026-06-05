import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { translations } from "../i18n/translations";

export const LanguageContext = createContext(null);

const LANGUAGE_STORAGE_KEY = "webDistrictLanguage";
const supportedLanguages = ["en", "ar"];

const getStoredLanguage = () => {
  if (typeof window === "undefined") return "en";

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

  return supportedLanguages.includes(storedLanguage) ? storedLanguage : "en";
};

const getNestedValue = (source, key) => {
  if (!key) return undefined;

  return key.split(".").reduce((value, segment) => {
    if (value === undefined || value === null) return undefined;
    return value[segment];
  }, source);
};

const interpolate = (value, params) => {
  if (typeof value !== "string" || !params) return value;

  return Object.entries(params).reduce(
    (text, [key, replacement]) =>
      text.replaceAll(`{${key}}`, replacement ?? ""),
    value
  );
};

function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getStoredLanguage);
  const [isAdminRoute, setIsAdminRoute] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.location.pathname.startsWith("/admin");
  });

  const effectiveLanguage = isAdminRoute ? "en" : language;
  const direction = effectiveLanguage === "ar" ? "rtl" : "ltr";
  const isArabic = effectiveLanguage === "ar";

  const setLanguage = useCallback((nextLanguage) => {
    const safeLanguage = supportedLanguages.includes(nextLanguage)
      ? nextLanguage
      : "en";

    setLanguageState(safeLanguage);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, safeLanguage);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "ar" ? "en" : "ar");
  }, [language, setLanguage]);

  const t = useCallback(
    (key, fallback, params) => {
      const translatedValue = getNestedValue(translations[effectiveLanguage], key);

      if (translatedValue !== undefined) {
        return interpolate(translatedValue, params);
      }

      const englishValue = getNestedValue(translations.en, key);

      if (englishValue !== undefined) {
        return interpolate(englishValue, params);
      }

      return interpolate(fallback ?? key, params);
    },
    [effectiveLanguage]
  );

  const translateValue = useCallback(
    (group, value) => {
      if (!value) return value;

      const translatedValue = translations[effectiveLanguage]?.common?.[group]?.[value];
      const englishValue = translations.en?.common?.[group]?.[value];

      return translatedValue || englishValue || value;
    },
    [effectiveLanguage]
  );

  const getErrorMessage = useCallback(
    (error, fallbackKey) => {
      const fallback = t(fallbackKey);

      if (isArabic) return fallback;

      return error?.response?.data?.message || fallback;
    },
    [isArabic, t]
  );

  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    const body = document.body;

    root.lang = effectiveLanguage;
    root.dir = direction;
    body.dir = direction;

    root.classList.toggle("lang-ar", isArabic);
    root.classList.toggle("lang-en", !isArabic);
    root.classList.toggle("rtl", isArabic);
    body.classList.toggle("lang-ar", isArabic);
    body.classList.toggle("lang-en", !isArabic);
    body.classList.toggle("rtl", isArabic);

    return () => {
      root.classList.remove("lang-ar", "lang-en", "rtl");
      body.classList.remove("lang-ar", "lang-en", "rtl");
    };
  }, [direction, effectiveLanguage, isArabic]);

  const value = useMemo(
    () => ({
      language,
      effectiveLanguage,
      direction,
      isArabic,
      isRtl: isArabic,
      isAdminRoute,
      setLanguage,
      toggleLanguage,
      setIsAdminRoute,
      t,
      translateValue,
      getErrorMessage,
    }),
    [
      direction,
      effectiveLanguage,
      isAdminRoute,
      isArabic,
      language,
      setLanguage,
      t,
      toggleLanguage,
      translateValue,
      getErrorMessage,
    ]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export default LanguageProvider;
