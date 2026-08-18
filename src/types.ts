/**
 * @module @arraypress/toast-astro/types
 *
 * Public types for `<Toast>`.
 */

import type { ToastManagerOptions, ToastManager, ToastVariant, ToastOptions } from './manager';

export type { ToastManager, ToastVariant, ToastOptions } from './manager';

/**
 * Props accepted by the `<Toast>` Astro component.
 */
export interface ToastProps {
	/**
	 * DOM id for the host element. Defaults to `'ap-toast-host'`.
	 * Choose your own when mounting more than one bar (rare).
	 */
	hostId?: string;
	/**
	 * Class-name prefix for the rendered markup. Defaults to `'toast'`.
	 * Pair with a matching stylesheet — the canonical one ships at
	 * `@arraypress/toast-astro/style.css` keyed on `.toast`.
	 */
	classPrefix?: string;
	/**
	 * Whether to wire `window.toast()` to this mount. Default: `true`.
	 * Set `false` if you're rolling your own global API or running
	 * multiple toast mounts on one page.
	 */
	exposeGlobal?: boolean;
	/**
	 * Name of the global. Default: `'toast'`. Honoured only when
	 * `exposeGlobal` is `true`.
	 */
	globalName?: string;
	/**
	 * Survive Astro view transitions. Default: `true`.
	 */
	persist?: boolean;
	/** Extra classes appended to the host element. */
	class?: string;
	/** Override per-variant icon HTML at runtime. */
	icons?: ToastManagerOptions['icons'];
}
