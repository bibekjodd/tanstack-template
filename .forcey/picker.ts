// Dev-only element picker for the Forcey Magic editor (plans/08 in the platform monorepo).
// Driven by .forcey/dev-agent.ts: when the editor turns the picker on, hovering outlines the
// nearest element the user's own code rendered, and a click reports where that element's JSX
// lives. Nothing here edits anything; the editor decides what to do with the location.
//
// The overlay is drawn inside this frame, where coordinates are native and scrolling is free,
// with `pointer-events: none` so it never swallows its own hover target.

const SOURCE_ATTRIBUTE = 'data-forcey-id';
const OVERLAY_ATTRIBUTE = 'data-forcey-overlay';
// shadcn primitives are shared by the whole app; selecting one means its call site, not button.tsx.
const SHARED_SOURCE_PREFIX = 'src/components/ui/';
// Interactions swallowed in the capture phase while picking, so clicking a link selects it
// instead of navigating the preview away.
const BLOCKED_EVENTS = [
  'click',
  'mousedown',
  'mouseup',
  'pointerdown',
  'pointerup',
  'auxclick',
  'submit'
];
const MAX_CLASSES = 40;

export type PickerSource = { file: string; line: number; column: number };

export type PickerSelection = {
  source: PickerSource;
  tag: string;
  classes: string[];
  rect: { top: number; left: number; width: number; height: number };
  // How many nodes on the page come from this one JSX location (a .map() renders many).
  instances: number;
};

export const parseSource = (id: string): PickerSource | null => {
  const match = /^(.+):(\d+):(\d+)$/.exec(id);
  if (!match) return null;
  return { file: match[1]!, line: Number(match[2]), column: Number(match[3]) };
};

// Walks up from whatever was hit to the nearest element the user's own feature code rendered.
const nearestMapped = (start: EventTarget | null): Element | null => {
  let node = start instanceof Element ? start : null;
  while (node) {
    if (node.hasAttribute(OVERLAY_ATTRIBUTE)) return null;
    const id = node.getAttribute(SOURCE_ATTRIBUTE);
    if (id && !id.startsWith(SHARED_SOURCE_PREFIX)) return node;
    node = node.parentElement;
  }
  return null;
};

export const createPicker = (callbacks: {
  onSelect: (selection: PickerSelection) => void;
  onCancel: () => void;
}) => {
  let overlay: HTMLDivElement | null = null;
  let label: HTMLSpanElement | null = null;
  let cursorStyle: HTMLStyleElement | null = null;
  let hovered: Element | null = null;
  let frame = 0;

  const draw = () => {
    frame = 0;
    if (!overlay || !label) return;
    if (!hovered || !hovered.isConnected) {
      overlay.style.display = 'none';
      return;
    }
    const rect = hovered.getBoundingClientRect();
    overlay.style.display = 'block';
    overlay.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
    const source = parseSource(hovered.getAttribute(SOURCE_ATTRIBUTE) ?? '');
    label.textContent = source ? `${source.file.split('/').pop()}:${source.line}` : '';
    // Keep the label on screen when the element sits at the top edge.
    label.style.top = rect.top < 24 ? '100%' : '-22px';
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(draw);
  };

  const onMove = (event: MouseEvent) => {
    const next = nearestMapped(event.target);
    if (next === hovered) return;
    hovered = next;
    schedule();
  };

  const onBlocked = (event: Event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (event.type !== 'click') return;
    const node = nearestMapped(event.target);
    const id = node?.getAttribute(SOURCE_ATTRIBUTE);
    const source = id ? parseSource(id) : null;
    if (!node || !id || !source) return;
    const rect = node.getBoundingClientRect();
    callbacks.onSelect({
      source,
      tag: node.tagName.toLowerCase(),
      classes: [...node.classList].slice(0, MAX_CLASSES),
      rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
      instances: document.querySelectorAll(`[${SOURCE_ATTRIBUTE}="${CSS.escape(id)}"]`).length
    });
  };

  const onKey = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    callbacks.onCancel();
  };

  const enable = () => {
    if (overlay) return;
    cursorStyle = document.createElement('style');
    cursorStyle.setAttribute(OVERLAY_ATTRIBUTE, '');
    cursorStyle.textContent = '* { cursor: crosshair !important; }';
    document.head.appendChild(cursorStyle);

    overlay = document.createElement('div');
    overlay.setAttribute(OVERLAY_ATTRIBUTE, '');
    overlay.style.cssText =
      'position:fixed;top:0;left:0;z-index:2147483647;display:none;pointer-events:none;' +
      'box-sizing:border-box;border:2px solid #2563eb;background:rgba(37,99,235,0.12);' +
      'border-radius:2px;';
    label = document.createElement('span');
    label.style.cssText =
      'position:absolute;left:-2px;padding:2px 6px;font:600 11px/16px ui-monospace,monospace;' +
      'color:#fff;background:#2563eb;border-radius:3px;white-space:nowrap;';
    overlay.appendChild(label);
    document.body.appendChild(overlay);

    document.addEventListener('mousemove', onMove, true);
    document.addEventListener('keydown', onKey, true);
    for (const type of BLOCKED_EVENTS) document.addEventListener(type, onBlocked, true);
    window.addEventListener('scroll', schedule, true);
    window.addEventListener('resize', schedule);
  };

  const disable = () => {
    if (!overlay) return;
    document.removeEventListener('mousemove', onMove, true);
    document.removeEventListener('keydown', onKey, true);
    for (const type of BLOCKED_EVENTS) document.removeEventListener(type, onBlocked, true);
    window.removeEventListener('scroll', schedule, true);
    window.removeEventListener('resize', schedule);
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    overlay.remove();
    cursorStyle?.remove();
    overlay = null;
    label = null;
    cursorStyle = null;
    hovered = null;
  };

  return { enable, disable };
};
