import { useEffect } from "react";

interface UseExamKeyboardShortcutsProps {
  onSelectChoice: (choiceIndex: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleFlag: () => void;
  onToggleNavigator: () => void;
  onToggleScratchpad?: () => void;
  onCloseModal?: () => void;
  isModalOpen?: boolean;
  isEnabled?: boolean;
}

export function useExamKeyboardShortcuts({
  onSelectChoice,
  onNext,
  onPrev,
  onToggleFlag,
  onToggleNavigator,
  onToggleScratchpad,
  onCloseModal,
  isModalOpen = false,
  isEnabled = true,
}: UseExamKeyboardShortcutsProps) {
  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is currently typing in an input, textarea, or contentEditable element
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        if (event.key === "Escape" && onCloseModal) {
          onCloseModal();
        }
        return;
      }

      // Handle Escape for any open modal
      if (event.key === "Escape") {
        if (onCloseModal) {
          event.preventDefault();
          onCloseModal();
        }
        return;
      }

      // If a blocking modal (like Review modal or Navigator) is active, only handle Escape
      if (isModalOpen) return;

      const key = event.key.toUpperCase();

      // Choice selection hotkeys: A, B, C, D, E or 1, 2, 3, 4, 5
      const choiceMap: Record<string, number> = {
        A: 0,
        "1": 0,
        B: 1,
        "2": 1,
        C: 2,
        "3": 2,
        D: 3,
        "4": 3,
        E: 4,
        "5": 4,
      };

      if (key in choiceMap && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        onSelectChoice(choiceMap[key]);
        return;
      }

      // Navigation: ArrowRight or J -> Next
      if (
        (event.key === "ArrowRight" || key === "J") &&
        !event.ctrlKey &&
        !event.metaKey
      ) {
        event.preventDefault();
        onNext();
        return;
      }

      // Navigation: ArrowLeft or K -> Previous
      if (
        (event.key === "ArrowLeft" || key === "K") &&
        !event.ctrlKey &&
        !event.metaKey
      ) {
        event.preventDefault();
        onPrev();
        return;
      }

      // Toggle Flag: F
      if (key === "F" && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        onToggleFlag();
        return;
      }

      // Toggle Question Navigator Palette: Q or P
      if (
        (key === "Q" || key === "P") &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      ) {
        event.preventDefault();
        onToggleNavigator();
        return;
      }

      // Toggle Scratchpad: S
      if (
        key === "S" &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        onToggleScratchpad
      ) {
        event.preventDefault();
        onToggleScratchpad();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isEnabled,
    isModalOpen,
    onSelectChoice,
    onNext,
    onPrev,
    onToggleFlag,
    onToggleNavigator,
    onToggleScratchpad,
    onCloseModal,
  ]);
}
