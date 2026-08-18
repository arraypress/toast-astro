/**
 * @module @arraypress/toast-astro
 *
 * Astro wrapper for `@arraypress/toast`. Renders one host element +
 * an init script that wires `window.toast()` (or the configured
 * global name) to a toast manager bound to that host. View-transition
 * safe via `transition:persist`.
 *
 * ```astro
 * ---
 * import '@arraypress/toast-astro/style.css';
 * import { Toast } from '@arraypress/toast-astro';
 * ---
 * <html>
 *   <body>
 *     <slot />
 *     <Toast />
 *   </body>
 * </html>
 * ```
 *
 * Then from any client script:
 *
 * ```js
 * window.toast('Saved');
 * window.toast.error('Save failed');
 * window.toast.success('Added to wishlist');
 * ```
 */

import Toast from './Toast.astro';
export default Toast;
export { Toast };
export type * from './types';

/*
 * The DOM-only toast manager, absorbed from @arraypress/toast in 2.0.0.
 * `<Toast />` inlines its own copy of this logic — it has to, since the
 * init script runs unbundled — so this export is for the cases the
 * component doesn't cover: driving toasts from a module script, or
 * mounting a second host with its own options.
 */
export { createToastManager } from './manager';
