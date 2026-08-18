/**
 * @arraypress/toast-astro — toast manager
 *
 * Zero-dependency toast notifications for the browser. Stacked,
 * auto-dismissing, accessible via `aria-live`. Four variants
 * (`success` / `info` / `warning` / `error`) drive accent colour,
 * icon, and the ARIA role (`alert` for error/warning, `status` for
 * the rest).
 *
 * Pair with the stylesheet at `@arraypress/toast-astro/style.css` for the
 * canonical look — or skip the import and provide your own CSS
 * keyed on the `.toast`, `.toast--<variant>`, and child class names.
 *
 * The library is **DOM-only** — it never touches `window`. To wire
 * it to a global `window.toast()` helper, do it at the app layer
 * (see `<Toast />` for the Astro mount).
 *
 * @module @arraypress/toast-astro/manager
 */

/**
 * @typedef {'success' | 'info' | 'warning' | 'error'} ToastVariant
 */

/**
 * @typedef {Object} ToastOptions
 * @property {ToastVariant} [variant='success']
 * @property {number} [duration=3000] - Auto-dismiss after this many ms. `0` = persistent.
 */

/**
 * @typedef {Object} ToastManagerOptions
 * @property {string} [hostId='ap-toast-host'] - DOM id for the host container if auto-created.
 * @property {HTMLElement} [host] - Pre-existing host element. Overrides `hostId`.
 * @property {Document} [document] - Override for tests / Web Workers.
 * @property {string} [classPrefix='toast'] - Class-name prefix for everything the manager renders.
 * @property {Record<ToastVariant, string>} [icons] - Override the per-variant SVG markup.
 */

/** Default inline-SVG icons keyed by variant. Stroke uses `currentColor`
 *  so each `.toast--<variant>` class can tint via `color`. */
const DEFAULT_ICONS = Object.freeze({
  success:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>',
  info:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  warning:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  error:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
});

const CLOSE_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

/**
 * Create a toast manager bound to a single host element.
 *
 * The host is created on first use if one doesn't already exist in
 * the DOM. The manager keeps a reference to it; calling `clear()`
 * empties the host, calling `destroy()` removes the host entirely
 * (and detaches all timers).
 *
 * @param {ToastManagerOptions} [options]
 * @returns {{
 *   show: (message: string, opts?: ToastOptions) => HTMLElement,
 *   success: (message: string, opts?: Omit<ToastOptions, 'variant'>) => HTMLElement,
 *   info:    (message: string, opts?: Omit<ToastOptions, 'variant'>) => HTMLElement,
 *   warning: (message: string, opts?: Omit<ToastOptions, 'variant'>) => HTMLElement,
 *   error:   (message: string, opts?: Omit<ToastOptions, 'variant'>) => HTMLElement,
 *   clear:   () => void,
 *   destroy: () => void,
 *   host:    () => HTMLElement | null,
 * }}
 */
export function createToastManager(options = {}) {
  const doc = options.document ?? (typeof document !== 'undefined' ? document : null);
  if (!doc) {
    throw new Error(
      '[@arraypress/toast] No document found. Pass options.document for non-browser environments.',
    );
  }
  const hostId = options.hostId ?? 'ap-toast-host';
  const classPrefix = options.classPrefix ?? 'toast';
  const icons = { ...DEFAULT_ICONS, ...(options.icons ?? {}) };

  let providedHost = options.host ?? null;
  const timers = new Set();

  function ensureHost() {
    if (providedHost) return providedHost;
    let existing = doc.getElementById(hostId);
    if (existing) {
      providedHost = existing;
      return existing;
    }
    const el = doc.createElement('div');
    el.id = hostId;
    el.className = `${classPrefix}-host`;
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-atomic', 'false');
    (doc.body ?? doc.documentElement).appendChild(el);
    providedHost = el;
    return el;
  }

  function show(message, opts = {}) {
    const variant = opts.variant ?? 'success';
    const duration = opts.duration != null ? opts.duration : 3000;
    const host = ensureHost();

    const el = doc.createElement('div');
    el.className = `${classPrefix} ${classPrefix}--${variant}`;
    el.setAttribute('role', variant === 'error' || variant === 'warning' ? 'alert' : 'status');

    const iconSpan = doc.createElement('span');
    iconSpan.className = `${classPrefix}-icon`;
    iconSpan.innerHTML = icons[variant] ?? icons.success;

    const messageSpan = doc.createElement('span');
    messageSpan.className = `${classPrefix}-message`;
    messageSpan.textContent = String(message);

    const closeBtn = doc.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = `${classPrefix}-close`;
    closeBtn.setAttribute('aria-label', 'Dismiss');
    closeBtn.innerHTML = CLOSE_ICON;

    el.appendChild(iconSpan);
    el.appendChild(messageSpan);
    el.appendChild(closeBtn);
    host.appendChild(el);

    /* Defer the visible class one frame so the initial styles register
     * and the CSS transition runs. Fallback to setTimeout for envs
     * (jsdom, some workers) where rAF is missing. */
    const raf = doc.defaultView?.requestAnimationFrame ?? ((cb) => setTimeout(cb, 0));
    raf(() => el.classList.add('is-visible'));

    function dismiss() {
      el.classList.remove('is-visible');
      const t = setTimeout(() => {
        el.remove();
        timers.delete(t);
      }, 250);
      timers.add(t);
    }
    closeBtn.addEventListener('click', dismiss);
    if (duration > 0) {
      const t = setTimeout(() => {
        dismiss();
        timers.delete(t);
      }, duration);
      timers.add(t);
    }

    return el;
  }

  return {
    show,
    success: (m, o = {}) => show(m, { ...o, variant: 'success' }),
    info:    (m, o = {}) => show(m, { ...o, variant: 'info' }),
    warning: (m, o = {}) => show(m, { ...o, variant: 'warning' }),
    error:   (m, o = {}) => show(m, { ...o, variant: 'error' }),
    /**
     * Force the host element into the DOM without firing a toast.
     * Useful when you want `aria-live` to be active before the first
     * toast (so screen readers don't miss the initial announcement)
     * or to pre-position the host before custom CSS measures it.
     */
    ensureHost() {
      return ensureHost();
    },
    clear() {
      const host = providedHost ?? doc.getElementById(hostId);
      if (host) host.innerHTML = '';
    },
    destroy() {
      for (const t of timers) clearTimeout(t);
      timers.clear();
      const host = providedHost ?? doc.getElementById(hostId);
      if (host) host.remove();
      providedHost = null;
    },
    host() {
      return providedHost ?? doc.getElementById(hostId);
    },
  };
}
