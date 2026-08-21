const GOOGLE_CLIENT_ID = '834655621185-i6933kmn8cssb9mib6sgtbuh5u1c852t.apps.googleusercontent.com';

declare global {
  interface Window {
    google?: any;
  }
}

/**
 * Ensures Google Identity Services SDK is loaded
 */
export const loadGoogleScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) {
      resolve();
      return;
    }

    const existingScript = document.getElementById('google-gsi-client');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Google SDK')));
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-client';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Identity Services SDK'));
    document.head.appendChild(script);
  });
};

/**
 * Triggers standard Google OAuth popup and returns access token
 */
export const triggerGoogleOAuth = async (): Promise<{ accessToken: string }> => {
  await loadGoogleScript();

  if (!window.google?.accounts?.oauth2) {
    throw new Error('Google Sign-In is unavailable. Please check your internet connection.');
  }

  return new Promise((resolve, reject) => {
    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'email profile openid',
        callback: (response: any) => {
          if (response.error) {
            reject(new Error(response.error_description || response.error || 'Google Sign-In was cancelled'));
            return;
          }
          if (!response.access_token) {
            reject(new Error('No access token received from Google'));
            return;
          }
          resolve({ accessToken: response.access_token });
        },
        error_callback: (err: any) => {
          reject(new Error(err?.message || 'Google Sign-In failed'));
        },
      });

      client.requestAccessToken();
    } catch (err: any) {
      reject(new Error(err.message || 'Failed to initialize Google Sign-In'));
    }
  });
};
