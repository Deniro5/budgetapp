import { useRef, useEffect } from "react";

export function useMenuFocus() {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      const firstFocusable = menuRef.current?.querySelector<HTMLElement>(
        'input, button, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    });
  }, []);

  return menuRef;
}
