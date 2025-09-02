"use client";

import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
  children: ReactNode;
  onClose?: () => void;
};

export default function ModalOverlay({ children, onClose }: Props) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const overlay = (
    <div
      role="dialog"
      aria-modal="true"
      className={[
        "fixed inset-0 z-[1000] flex items-start justify-center p-4",
        "bg-black/60",
        "supports-[backdrop-filter:blur(0)]:bg-black/40",
        "supports-[backdrop-filter:blur(0)]:backdrop-blur-md",
      ].join(" ")}
      style={{
        WebkitBackdropFilter: "saturate(180%) blur(12px)",
        backdropFilter: "saturate(180%) blur(12px)",
      }}
      onClick={onClose}
    >
      <div
        className="mx-auto flex h-full w-full max-w-lg items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );

  if (typeof window === "undefined") return null;
  return createPortal(overlay, document.body);
}
