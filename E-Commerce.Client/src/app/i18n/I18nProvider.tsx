import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import en from './locales/en.json';
import tr from './locales/tr.json';
import ru from './locales/ru.json';
import az from './locales/az.json';
import {
  getStoredLanguage,
  LANGUAGE_CHANGED_EVENT,
  LANGUAGE_STORAGE_KEY,
  SupportedLanguage,
} from '../config/runtime';

type TranslationDictionary = Record<string, string>;
type TranslationParams = Record<string, string | number>;

const dictionaries: Record<SupportedLanguage, TranslationDictionary> = {
  en,
  tr,
  ru,
  az,
};

const localeMap: Record<SupportedLanguage, string> = {
  en: 'en-US',
  tr: 'tr-TR',
  ru: 'ru-RU',
  az: 'az-AZ',
};

const sourceKeys = new Set(Object.keys(en));
const aliases = new Map<string, string>();
Object.keys(en).forEach((key) => {
  aliases.set(key, key);
  (Object.keys(dictionaries) as SupportedLanguage[]).forEach((language) => {
    const value = dictionaries[language][key];
    if (value && !aliases.has(value)) aliases.set(value, key);
  });
});

function interpolate(value: string, params?: TranslationParams) {
  if (!params) return value;

  return value.replace(/\{\{\s*([^}\s]+)\s*\}\}/g, (_, key: string) => {
    const replacement = params[key];
    return replacement === undefined ? '' : String(replacement);
  });
}

function translateDynamic(value: string, language: SupportedLanguage) {
  const pageMatch = value.match(/^Page\s+(\d+)\s+of\s+(\d+)$/i);
  if (pageMatch) {
    return `${translateText('Page', undefined, language)} ${pageMatch[1]} ${translateText('of', undefined, language)} ${pageMatch[2]}`;
  }

  const itemMatch = value.match(/^(\d+)\s+items?$/i);
  if (itemMatch) {
    return `${itemMatch[1]} ${translateText('items', undefined, language)}`;
  }

  const orderMatch = value.match(/^Order\s+#?(.+)$/i);
  if (orderMatch) {
    return `${translateText('Order', undefined, language)} #${orderMatch[1].replace(/^#/, '')}`;
  }

  const showingMatch = value.match(/^Showing\s+(.+?)\s+of\s+(.+?)\s+products$/i);
  if (showingMatch) {
    return `${translateText('Showing', undefined, language)} ${showingMatch[1]} ${translateText('of', undefined, language)} ${showingMatch[2]} ${translateText('products', undefined, language)}`;
  }

  const addToCartMatch = value.match(/^Add to cart:\s*(.+)$/i);
  if (addToCartMatch) {
    return translateText('Add to cart: {{product}}', { product: addToCartMatch[1] }, language);
  }

  return value;
}

export function translateText(
  value: string,
  params?: TranslationParams,
  language: SupportedLanguage = getStoredLanguage(),
) {
  const key = sourceKeys.has(value) ? value : aliases.get(value) ?? value;
  const translated = dictionaries[language][key] ?? translateDynamic(value, language);
  return interpolate(translated, params);
}

export function getLanguageLocale(language: SupportedLanguage = getStoredLanguage()) {
  return localeMap[language];
}

interface I18nContextValue {
  language: SupportedLanguage;
  locale: string;
  t: (value: string, params?: TranslationParams) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const TRANSLATABLE_ATTRIBUTES = ['placeholder', 'title', 'aria-label', 'alt'] as const;
const SKIPPED_TAGS = new Set(['SCRIPT', 'STYLE', 'CODE', 'PRE', 'TEXTAREA']);

function translateTextNode(node: Text, language: SupportedLanguage) {
  const parent = node.parentElement;
  if (!parent || SKIPPED_TAGS.has(parent.tagName) || parent.closest('[data-i18n-ignore="true"]')) return;

  const original = node.nodeValue ?? '';
  const match = original.match(/^(\s*)([\s\S]*?)(\s*)$/);
  if (!match || !match[2]) return;

  const translated = translateText(match[2], undefined, language);
  const next = `${match[1]}${translated}${match[3]}`;
  if (next !== original) node.nodeValue = next;
}

function translateElement(element: Element, language: SupportedLanguage) {
  if (element.closest('[data-i18n-ignore="true"]')) return;

  TRANSLATABLE_ATTRIBUTES.forEach((attribute) => {
    const value = element.getAttribute(attribute);
    if (!value) return;

    const translated = translateText(value, undefined, language);
    if (translated !== value) element.setAttribute(attribute, translated);
  });
}

function translateSubtree(root: Node, language: SupportedLanguage) {
  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root as Text, language);
    return;
  }

  if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;

  if (root.nodeType === Node.ELEMENT_NODE) translateElement(root as Element, language);

  const textWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let currentText = textWalker.nextNode();
  while (currentText) {
    translateTextNode(currentText as Text, language);
    currentText = textWalker.nextNode();
  }

  if (root instanceof Element || root instanceof DocumentFragment) {
    root.querySelectorAll('*').forEach((element) => translateElement(element, language));
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<SupportedLanguage>(() => getStoredLanguage());

  useEffect(() => {
    const onLanguageChanged = (event: Event) => {
      const nextLanguage = (event as CustomEvent<SupportedLanguage>).detail ?? getStoredLanguage();
      setLanguage(nextLanguage);
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === LANGUAGE_STORAGE_KEY) setLanguage(getStoredLanguage());
    };

    window.addEventListener(LANGUAGE_CHANGED_EVENT, onLanguageChanged);
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener(LANGUAGE_CHANGED_EVENT, onLanguageChanged);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  useLayoutEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = 'ltr';

    translateSubtree(document.body, language);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'characterData') {
          translateSubtree(mutation.target, language);
          return;
        }

        if (mutation.type === 'attributes' && mutation.target instanceof Element) {
          translateElement(mutation.target, language);
          return;
        }

        mutation.addedNodes.forEach((node) => translateSubtree(node, language));
      });
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...TRANSLATABLE_ATTRIBUTES],
    });

    return () => observer.disconnect();
  }, [language]);

  const t = useCallback(
    (value: string, params?: TranslationParams) => translateText(value, params, language),
    [language],
  );

  const value = useMemo<I18nContextValue>(
    () => ({ language, locale: localeMap[language], t }),
    [language, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider.');
  return context;
}
