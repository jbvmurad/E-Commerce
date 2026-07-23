import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  GOOGLE_CLIENT_ID,
  getStoredLanguage,
} from '../../config/runtime';

type GoogleAuthMode = 'login' | 'register';

interface GoogleAuthButtonProps {
  mode: GoogleAuthMode;
  disabled?: boolean;
  onCredential: (credential: string) => Promise<void> | void;
  onError?: (message: string) => void;
}

const GOOGLE_SCRIPT_ID = 'google-identity-services';
const GOOGLE_SCRIPT_URL =
  'https://accounts.google.com/gsi/client';

function loadGoogleIdentityScript(): Promise<void> {
  if (window.google?.accounts.id) {
    return Promise.resolve();
  }

  const existingScript = document.getElementById(
    GOOGLE_SCRIPT_ID,
  ) as HTMLScriptElement | null;

  if (existingScript) {
    return new Promise((resolve, reject) => {
      const handleLoad = () => {
        cleanup();
        resolve();
      };

      const handleError = () => {
        cleanup();

        reject(
          new Error(
            'Google Identity Services yüklenemedi.',
          ),
        );
      };

      const cleanup = () => {
        existingScript.removeEventListener(
          'load',
          handleLoad,
        );

        existingScript.removeEventListener(
          'error',
          handleError,
        );
      };

      existingScript.addEventListener(
        'load',
        handleLoad,
        { once: true },
      );

      existingScript.addEventListener(
        'error',
        handleError,
        { once: true },
      );

      return;
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');

    script.id = GOOGLE_SCRIPT_ID;
    script.src = GOOGLE_SCRIPT_URL;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      resolve();
    };

    script.onerror = () => {
      reject(
        new Error(
          'Google Identity Services yüklenemedi.',
        ),
      );
    };

    document.head.appendChild(script);
  });
}

function GoogleLogo() {
  return (
    <svg
      viewBox="0 0 18 18"
      aria-hidden="true"
      className="h-[19px] w-[19px] shrink-0"
    >
      <path
        fill="#EA4335"
        d="M17.64 9.205c0-.638-.057-1.252-.164-1.841H9v3.482h4.844a4.14 4.14 0 0 1-1.797 2.715v2.258h2.909c1.702-1.567 2.684-3.874 2.684-6.614Z"
      />

      <path
        fill="#4285F4"
        d="M9 18c2.43 0 4.468-.806 5.956-2.181l-2.91-2.258c-.805.54-1.835.859-3.046.859-2.344 0-4.328-1.585-5.037-3.714H.956v2.332A9 9 0 0 0 9 18Z"
      />

      <path
        fill="#FBBC05"
        d="M3.963 10.706A5.41 5.41 0 0 1 3.682 9c0-.592.102-1.167.281-1.706V4.962H.956A9 9 0 0 0 0 9c0 1.45.347 2.824.956 4.038l3.007-2.332Z"
      />

      <path
        fill="#34A853"
        d="M9 3.58c1.321 0 2.507.454 3.441 1.346l2.581-2.581C13.464.892 11.427 0 9 0A9 9 0 0 0 .956 4.962l3.007 2.332C4.672 5.165 6.656 3.58 9 3.58Z"
      />
    </svg>
  );
}

export function GoogleAuthButton({
  mode,
  disabled = false,
  onCredential,
  onError,
}: GoogleAuthButtonProps) {
  const googleButtonRef =
    useRef<HTMLDivElement>(null);

  const onCredentialRef = useRef(onCredential);
  const onErrorRef = useRef(onError);

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] =
    useState(false);

  const [
    configurationError,
    setConfigurationError,
  ] = useState('');

  useEffect(() => {
    onCredentialRef.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    let cancelled = false;

    const renderGoogleButton = async () => {
      setLoading(true);
      setConfigurationError('');

      if (!GOOGLE_CLIENT_ID) {
        const message =
          'VITE_GOOGLE_CLIENT_ID yapılandırılmadı.';

        setConfigurationError(message);
        setLoading(false);
        onErrorRef.current?.(message);

        return;
      }

      try {
        await loadGoogleIdentityScript();

        if (
          cancelled ||
          !googleButtonRef.current ||
          !window.google?.accounts.id
        ) {
          return;
        }

        googleButtonRef.current.innerHTML = '';

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: true,

          callback: async ({ credential }) => {
            if (!credential) {
              onErrorRef.current?.(
                'Google kimlik bilgisi alınamadı.',
              );

              return;
            }

            setProcessing(true);

            try {
              await onCredentialRef.current(
                credential,
              );
            } catch (error) {
              const message =
                error instanceof Error
                  ? error.message
                  : 'Google işlemi tamamlanamadı.';

              onErrorRef.current?.(message);
            } finally {
              setProcessing(false);
            }
          },
        });

        const parentWidth =
          googleButtonRef.current.parentElement
            ?.clientWidth ?? 368;

        const buttonWidth = Math.max(
          200,
          Math.min(400, parentWidth),
        );

        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text:
              mode === 'login'
                ? 'signin_with'
                : 'signup_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: buttonWidth,
            locale: getStoredLanguage(),
          },
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : 'Google Identity Services yüklenemedi.';

        setConfigurationError(message);
        onErrorRef.current?.(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void renderGoogleButton();

    return () => {
      cancelled = true;

      if (googleButtonRef.current) {
        googleButtonRef.current.innerHTML = '';
      }
    };
  }, [mode]);

  if (configurationError) {
    return (
      <div className="w-full border border-red-500/30 bg-red-500/5 px-4 py-3 text-center text-xs text-red-300">
        {configurationError}
      </div>
    );
  }

  const label =
    mode === 'login'
      ? 'Sign in with Google'
      : 'Sign up with Google';

  return (
    <div
      className={`
        group
        relative
        h-12
        w-full
        overflow-hidden
        border
        bg-transparent
        transition-all
        duration-300

        ${
          disabled || processing
            ? 'cursor-not-allowed border-[#00f5ff]/20 opacity-60'
            : `
              cursor-pointer
              border-[#00f5ff]/45
              hover:border-[#00f5ff]
              hover:bg-[#00f5ff]/[0.06]
              hover:shadow-[0_0_24px_rgba(0,245,255,0.22)]
              focus-within:border-[#00f5ff]
              focus-within:shadow-[0_0_24px_rgba(0,245,255,0.25)]
            `
        }
      `}
    >
      {/* Kullanıcıya görünen özel buton tasarımı */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          z-10
          flex
          items-center
          justify-center
          gap-3
          bg-transparent
          px-4
          text-sm
          font-medium
          tracking-wide
          text-[#d8fbff]
          transition-all
          duration-300
          group-hover:text-[#00f5ff]
        "
      >
        <GoogleLogo />

        <span>{label}</span>
      </div>

      {/*
        Gerçek Google butonu bu katmandadır.
        Neredeyse görünmezdir fakat tıklanabilir kalır.
      */}
      <div
        ref={googleButtonRef}
        aria-label={label}
        style={{ opacity: 0.01 }}
        className={`
          absolute
          inset-0
          z-20
          flex
          h-full
          w-full
          items-center
          justify-center
          overflow-hidden

          [&>div]:!h-full
          [&>div]:!w-full
          [&>div]:!max-w-none
          [&_iframe]:!h-full
          [&_iframe]:!w-full

          ${
            disabled || processing
              ? 'pointer-events-none'
              : 'pointer-events-auto cursor-pointer'
          }
        `}
      />

      {(loading || processing) && (
        <div
          className="
            absolute
            inset-0
            z-30
            flex
            items-center
            justify-center
            gap-2
            bg-[#050d15]
            text-sm
            text-[#00f5ff]
          "
        >
          <Loader2
            size={16}
            className="animate-spin"
          />

          <span>
            {processing
              ? 'Google doğrulanıyor…'
              : 'Google yükleniyor…'}
          </span>
        </div>
      )}

      {disabled &&
        !loading &&
        !processing && (
          <div className="absolute inset-0 z-30 cursor-not-allowed bg-[#02070c]/40" />
        )}
    </div>
  );
}