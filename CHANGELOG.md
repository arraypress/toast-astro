# Changelog

All notable changes to this project will be documented in this file.

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
