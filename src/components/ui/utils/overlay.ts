export const appendChildElement = (element: HTMLElement, parent?: HTMLElement) => (parent ?? document.body).appendChild(element);
export const removeElement = (element: HTMLElement) => element.remove();

const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'summary',
    '[contenteditable="true"]',
    '[tabindex]:not([tabindex="-1"])',
].join(',');

// `checkVisibility` solo necesita estilos calculados (no fuerza layout como `offsetParent`)
// y, a diferencia de `offsetParent`, no da falsos negativos con `position: fixed`.
const isVisible = (element: HTMLElement) =>
    (element.checkVisibility?.() ?? element.getClientRects().length > 0) && !element.closest('[aria-hidden="true"]');

export const getFocusable = (root: HTMLElement) =>
    Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(isVisible);

export const trapFocus = (root: HTMLElement, event: KeyboardEvent) => {
    const focusables = getFocusable(root);

    if (focusables.length === 0) {
        event.preventDefault();
        root.focus({ preventScroll: true });
        return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    // Foco en el propio contenedor (tabindex="-1") o fuera del modal: se entra por el extremo que toque.
    const isOutside = active === root || !root.contains(active);

    if (event.shiftKey) {
        if (isOutside || active === first) {
            event.preventDefault();
            last.focus();
        }
    } else if (isOutside || active === last) {
        event.preventDefault();
        first.focus();
    }
};