/**
 * @arraypress/toast-astro — toast manager type definitions.
 */

export type ToastVariant = 'success' | 'info' | 'warning' | 'error';

export interface ToastOptions {
  variant?: ToastVariant;
  /** Auto-dismiss after this many ms. `0` keeps the toast until
   *  the user dismisses it. Default: `3000`. */
  duration?: number;
}

export interface ToastManagerOptions {
  /** DOM id for the host container if auto-created. Default: `'ap-toast-host'`. */
  hostId?: string;
  /** Pre-existing host element. Overrides `hostId`. */
  host?: HTMLElement;
  /** Document override for tests / non-browser environments. */
  document?: Document;
  /** Class-name prefix for everything the manager renders. Default: `'toast'`. */
  classPrefix?: string;
  /** Override the per-variant SVG markup. */
  icons?: Partial<Record<ToastVariant, string>>;
}

export interface ToastManager {
  /** Show a toast. Returns the rendered element. */
  show(message: string, opts?: ToastOptions): HTMLElement;
  success(message: string, opts?: Omit<ToastOptions, 'variant'>): HTMLElement;
  info(message: string, opts?: Omit<ToastOptions, 'variant'>): HTMLElement;
  warning(message: string, opts?: Omit<ToastOptions, 'variant'>): HTMLElement;
  error(message: string, opts?: Omit<ToastOptions, 'variant'>): HTMLElement;
  /** Force the host element into the DOM without firing a toast.
   *  Useful when you want `aria-live` to be active before the first
   *  toast (so screen readers don't miss the initial announcement). */
  ensureHost(): HTMLElement;
  /** Empty the host. */
  clear(): void;
  /** Remove the host + cancel all pending timers. */
  destroy(): void;
  /** Read the host element, or `null` if it hasn't been created yet. */
  host(): HTMLElement | null;
}

export function createToastManager(options?: ToastManagerOptions): ToastManager;
