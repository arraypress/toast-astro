/**
 * @module globals
 *
 * Ambient declaration for the `window.toast` global installed by
 * `<Toast>`'s inline script.
 *
 * Lets you write:
 *
 * ```ts
 * window.toast?.('Saved');
 * window.toast?.error?.('Save failed');
 * ```
 *
 * without TypeScript complaining. The shape mirrors the public
 * surface of the runtime API.
 */

import type { ToastOptions } from './manager';

type ToastFn = ((message: string, opts?: ToastOptions) => HTMLElement | null) & {
	show:    (message: string, opts?: ToastOptions) => HTMLElement | null;
	success: (message: string, opts?: Omit<ToastOptions, 'variant'>) => HTMLElement | null;
	info:    (message: string, opts?: Omit<ToastOptions, 'variant'>) => HTMLElement | null;
	warning: (message: string, opts?: Omit<ToastOptions, 'variant'>) => HTMLElement | null;
	error:   (message: string, opts?: Omit<ToastOptions, 'variant'>) => HTMLElement | null;
	clear:   () => void;
};

declare global {
	interface Window {
		/**
		 * Installed by `<Toast>` when `exposeGlobal` (default `true`)
		 * is on. Renamed by the `globalName` prop.
		 */
		toast?: ToastFn;
		/** @internal */
		__apToastAstroInitBound?: boolean;
	}
}

export {};
