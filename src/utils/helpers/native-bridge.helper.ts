/**
 * Bridge to the React Native shell that hosts this app in a WebView.
 *
 * The same build is also served as a plain website, where none of this exists, so every
 * helper degrades to a no-op instead of throwing -- callers never branch on the host.
 *
 * The shell half of this contract lives in the `pet-home` repo, in
 * `src/screens/home/HomeScreen.tsx`. The string constants below are duplicated there and
 * must be changed in both places together.
 */

/** Identifies our traffic on the postMessage channel, which third-party scripts share. */
const BRIDGE_SOURCE = 'pet-simulator';

/** Window event the shell dispatches once it knows whether an ad actually ran. */
export const NATIVE_AD_EVENT = 'petshell:ad';

/**
 * Actions allowed to trigger a full-screen ad.
 *
 * `feed` and `play` are unprompted; `reward` is the gift button, where the user asked for
 * the ad in exchange for coins. The shell treats them identically and echoes the trigger
 * back, so adding one here needs no change to the native app.
 */
export type AdTriggerType = 'feed' | 'play' | 'reward';

/** Sent web -> native. */
export type NativeAdRequestType = {
  source: typeof BRIDGE_SOURCE;
  type: 'ad:show';
  trigger: AdTriggerType;
};

/** Sent native -> web, as the `detail` of a {@link NATIVE_AD_EVENT} CustomEvent. */
export type NativeAdEventType = {
  type: 'ad:shown' | 'ad:unavailable';
  trigger: AdTriggerType;
};

declare global {
  interface Window {
    ReactNativeWebView?: { postMessage: (message: string) => void };
  }
}

/** True only inside the RN WebView; false in a normal browser tab. */
export const isNativeShell = () => typeof window !== 'undefined' && Boolean(window.ReactNativeWebView);

/**
 * Asks the shell to play a full-screen ad. Returns false when there is no shell to ask.
 *
 * Fire-and-forget: whether an ad was available comes back asynchronously on
 * {@link NATIVE_AD_EVENT}, because the shell may still be fetching one.
 */
export const requestNativeAd = (trigger: AdTriggerType) => {
  if (!isNativeShell()) return false;

  const request: NativeAdRequestType = { source: BRIDGE_SOURCE, type: 'ad:show', trigger };
  window.ReactNativeWebView?.postMessage(JSON.stringify(request));

  return true;
};
