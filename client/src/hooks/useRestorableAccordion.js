import { useCallback, useLayoutEffect, useRef } from "react";

const interactiveSelector =
  "a, button, input, textarea, select, summary, [role='button'], [contenteditable='true']";

function useRestorableAccordion({ openKey, setOpenKey }) {
  const panelPointerRef = useRef(null);
  const openingScrollPositionsRef = useRef(new Map());
  const pendingRestoreRef = useRef(null);

  useLayoutEffect(() => {
    if (openKey !== null || pendingRestoreRef.current === null) return;

    const restoreTop = pendingRestoreRef.current;
    pendingRestoreRef.current = null;
    const maxScroll = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    );

    window.scrollTo({
      top: Math.min(Math.max(restoreTop, 0), maxScroll),
      left: 0,
      behavior: "auto",
    });
  }, [openKey]);

  const rememberOpenPosition = useCallback((key, scrollTop = window.scrollY) => {
    openingScrollPositionsRef.current.set(key, scrollTop);
  }, []);

  const toggleItem = useCallback((key) => {
    if (openKey === key) {
      pendingRestoreRef.current =
        openingScrollPositionsRef.current.get(key) ?? window.scrollY;
      setOpenKey(null);
      return;
    }

    pendingRestoreRef.current = null;
    rememberOpenPosition(key);
    setOpenKey(key);
  }, [openKey, rememberOpenPosition, setOpenKey]);

  const resetOpenItem = useCallback(() => {
    pendingRestoreRef.current = null;
    openingScrollPositionsRef.current.clear();
    setOpenKey(null);
  }, [setOpenKey]);

  const handlePanelPointerDown = useCallback((event) => {
    panelPointerRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
  }, []);

  const handlePanelClick = useCallback((event, key) => {
    if (event.target.closest(interactiveSelector)) return;

    const pointer = panelPointerRef.current;
    panelPointerRef.current = null;
    const moved =
      pointer &&
      Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) > 5;
    const selection = window.getSelection();

    if (moved || (selection && !selection.isCollapsed && selection.toString().trim())) {
      return;
    }

    if (openKey === key) toggleItem(key);
  }, [openKey, toggleItem]);

  return {
    handlePanelClick,
    handlePanelPointerDown,
    rememberOpenPosition,
    resetOpenItem,
    toggleItem,
  };
}

export default useRestorableAccordion;
