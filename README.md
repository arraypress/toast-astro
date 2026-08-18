# @arraypress/toast-astro

> Toast notifications for Astro — stacked, auto-dismissing, accessible. Zero dependencies.
> One `<Toast />` mount + a `window.toast()` global, view-transition
> safe.

## Install

```bash
npm install @arraypress/toast-astro
```

The vanilla package is a peer dependency for its types + canonical
stylesheet. The runtime is inlined in the component's script, so
you don't need a bundler to pull it into client code.

## Use

```astro
---
// src/layouts/Layout.astro
import '@arraypress/toast-astro/style.css';
import { Toast } from '@arraypress/toast-astro';
---
<html>
  <body>
    <slot />
    <Toast />
  </body>
</html>
```

Then from any client `<script>` (or any component using `client:load`,
`client:visible`, etc.):

```js
window.toast('Saved');
window.toast.success('Added to wishlist');
window.toast.info('Synced 3 minutes ago');
window.toast.warning('Some items skipped');
window.toast.error('Save failed', { duration: 5000 });
window.toast.clear();
```

## Props

| Prop           | Default            | Description                                                        |
|----------------|--------------------|--------------------------------------------------------------------|
| `hostId`       | `'ap-toast-host'`  | DOM id for the host element.                                       |
| `classPrefix`  | `'toast'`          | Class-name prefix. Match against the stylesheet you ship.          |
| `exposeGlobal` | `true`             | Wire `window[globalName]` to the manager. Set `false` to opt out.  |
| `globalName`   | `'toast'`          | Name of the global if exposed.                                     |
| `persist`      | `true`             | Survive Astro view transitions.                                    |
| `class`        | —                  | Extra classes appended to the host element.                        |
| `icons`        | built-in SVGs      | Per-variant icon HTML override.                                    |

## TypeScript

The package ships an ambient declaration for `window.toast` — once
the component is mounted, calls like `window.toast.success('done')`
typecheck without further setup.

## License

MIT
