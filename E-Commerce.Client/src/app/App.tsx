import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ThemeProvider } from './context/ThemeContext';
import { I18nProvider, useI18n } from './i18n';

function LocalizedApplication() {
  const { language } = useI18n();

  return (
    <ThemeProvider>
      <RouterProvider key={language} router={router} />
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <LocalizedApplication />
    </I18nProvider>
  );
}
