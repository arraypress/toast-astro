# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] — Unreleased

### Changed

- **Breaking:** absorbed `@arraypress/toast`. The core is no longer a peer
  dependency — install only `@arraypress/toast-astro`. Its stylesheet moved
  from `@arraypress/toast/style.css` to `@arraypress/toast-astro/style.css`,
  and `createToastManager()` plus the `ToastVariant` / `ToastOptions` /
  `ToastManager` types are now exported from this package. `@arraypress/toast`
  is deprecated; the React wrapper that justified a framework-free core was
  retired, leaving Astro as the only consumer.

### Migration

- `npm uninstall @arraypress/toast`
- `import '@arraypress/toast/style.css'` → `import '@arraypress/toast-astro/style.css'`
- `import { createToastManager } from '@arraypress/toast'` →
  `import { createToastManager } from '@arraypress/toast-astro'`
- No change to `<Toast />` props, the emitted class hooks, or `window.toast()`.

## [1.0.1] — Unreleased

### Changed

- Widened the `astro` peerDependency to `^6.0.0 || ^7.0.0` for
  Astro 7 readiness. No runtime changes — the component is unaffected by the
  Astro 7 compiler / Vite 8 (Rolldown) upgrade.

## [1.0.0] — Unreleased

### Initial Release

- `<Toast />` — singleton mount that renders the aria-live host
  + an inline script wiring `window.toast()` (or the configured
  `globalName`) to a manager bound to the host. View-transition
  safe via `transition:persist`.
- Props: `hostId`, `classPrefix`, `exposeGlobal`, `globalName`,
  `persist`, `class`, `icons`.
- Idempotent — the inline script self-deduplicates so multiple
  page loads + view transitions don't re-bind.
- Peer-dependency on `@arraypress/toast` for the matching CSS
  conventions; the runtime itself is inlined so consumers don't
  need a bundler to pull the package into client code.

16 tests passing under Astro's experimental_AstroContainer.
