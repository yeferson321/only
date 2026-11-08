export const appendChildElement = (element: HTMLElement, parent?: HTMLElement) => (parent ?? document.body).appendChild(element);
export const removeElement = (element: HTMLElement) => element.remove();

const FOCUSABLE_SELECTOR = ':is(button, [href], input, select, textarea, summary, [tabindex]:not([tabindex="-1"])):not([disabled]):not([aria-hidden="true"])';

export const trapFocus = (element: HTMLElement, event: KeyboardEvent) => {
    const focusables = Array.from(element.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((HTMLElement) => HTMLElement.offsetParent !== null);

    // Sin elementos focusables: el foco se queda en el propio modal.
    if (focusables.length === 0) {
        event.preventDefault();
        element.focus();
        return;
    }

    const firstFocusable = focusables[0];
    const lastFocusable = focusables[focusables.length - 1];
    const activeElement = document.activeElement;

    // Foco en el propio contenedor o fuera del modal: se entra por el extremo que toque.
    const isOutside = activeElement === element || !element.contains(activeElement);
    const boundary = event.shiftKey ? firstFocusable : lastFocusable;

    if (isOutside || activeElement === boundary) {
        event.preventDefault();
        (event.shiftKey ? lastFocusable : firstFocusable).focus();
    }
};