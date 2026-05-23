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
 * import '@arraypress/toast/style.css';
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
