/**
 * test/Toast.test.ts
 * ------------------
 *
 * Output tests for the singleton <Toast> mount.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import ToastRaw from '../src/Toast.astro';
import type { ToastProps } from '../src/types';

const Toast = ToastRaw as Parameters<AstroContainer['renderToString']>[0];

let container: AstroContainer;

beforeAll(async () => {
	container = await AstroContainer.create();
});

async function render(props: ToastProps = {}): Promise<string> {
	return container.renderToString(Toast, {
		props: props as unknown as Record<string, unknown>,
	});
}

function getAttr(html: string, name: string): string | null {
	const valued = new RegExp(`\\s${name}="([^"]*)"`).exec(html);
	const bare = new RegExp(`\\s${name}(?=[\\s>])`).test(html);
	if (valued) return valued[1];
	if (bare) return '';
	return null;
}

// ─── Host element ────────────────────────────────────────────────

describe('<Toast> — host', () => {
	it('renders a single host div with the default id', async () => {
		const html = await render();
		expect(getAttr(html, 'id')).toBe('ap-toast-host');
	});

	it('host carries aria-live="polite" + aria-atomic="false"', async () => {
		const html = await render();
		expect(getAttr(html, 'aria-live')).toBe('polite');
		expect(getAttr(html, 'aria-atomic')).toBe('false');
	});

	it('honours a custom hostId', async () => {
		const html = await render({ hostId: 'my-toasts' });
		expect(getAttr(html, 'id')).toBe('my-toasts');
	});

	it('merges user-supplied class with the prefix-derived host class', async () => {
		const html = await render({ class: 'theme-dark' });
		const classes = getAttr(html, 'class') ?? '';
		expect(classes).toContain('toast-host');
		expect(classes).toContain('theme-dark');
	});

	it('classPrefix overrides the host class', async () => {
		const html = await render({ classPrefix: 'wg-toast' });
		const classes = getAttr(html, 'class') ?? '';
		expect(classes).toContain('wg-toast-host');
	});
});

// ─── Persist toggle ──────────────────────────────────────────────

describe('<Toast> — persist prop', () => {
	it('adds the transition:persist attribute by default', async () => {
		const html = await render();
		expect(html).toMatch(/data-astro-transition-persist|transition:persist/);
	});

	it('omits the persist attribute when persist=false', async () => {
		const html = await render({ persist: false });
		expect(html).not.toMatch(/data-astro-transition-persist/);
	});
});

// ─── Inline init script ──────────────────────────────────────────

describe('<Toast> — inline script', () => {
	it('passes hostId through as TOAST_HOST_ID', async () => {
		const html = await render({ hostId: 'my-toasts' });
		expect(html).toMatch(/TOAST_HOST_ID\s*=\s*"my-toasts"/);
	});

	it('passes classPrefix through as TOAST_CLASS_PREFIX', async () => {
		const html = await render({ classPrefix: 'wg-toast' });
		expect(html).toMatch(/TOAST_CLASS_PREFIX\s*=\s*"wg-toast"/);
	});

	it('exposeGlobal defaults to true', async () => {
		const html = await render();
		expect(html).toMatch(/TOAST_EXPOSE_GLOBAL\s*=\s*true/);
	});

	it('exposeGlobal=false serialises false', async () => {
		const html = await render({ exposeGlobal: false });
		expect(html).toMatch(/TOAST_EXPOSE_GLOBAL\s*=\s*false/);
	});

	it('globalName defaults to "toast"', async () => {
		const html = await render();
		expect(html).toMatch(/TOAST_GLOBAL_NAME\s*=\s*"toast"/);
	});

	it('globalName="notify" propagates', async () => {
		const html = await render({ globalName: 'notify' });
		expect(html).toMatch(/TOAST_GLOBAL_NAME\s*=\s*"notify"/);
	});

	it('declares the __apToastAstroInitBound dedup flag', async () => {
		const html = await render();
		expect(html).toContain('__apToastAstroInitBound');
	});

	it('install path uses window[TOAST_GLOBAL_NAME]', async () => {
		const html = await render();
		expect(html).toContain('window[TOAST_GLOBAL_NAME]');
	});

	it('icons prop is passed through TOAST_ICONS', async () => {
		const html = await render({ icons: { success: '<custom/>' } });
		expect(html).toContain('TOAST_ICONS');
		/* Astro's define:vars escapes `<` to `<` to avoid breaking
		 * the surrounding `<script>` tag — assert on the escaped form. */
		expect(html).toMatch(/TOAST_ICONS\s*=\s*\{.*custom.*\}/);
	});
});
