"use client";
import { useCallback, useState } from "react";

export function useModalState<T = undefined>() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<T | undefined>(undefined);

  const onOpen = useCallback((payload?: T) => {
    setData(payload);
    setOpen(true);
  }, []);

  const onClose = useCallback(() => {
    setOpen(false);
    setData(undefined);
  }, []);

  return { open, data, onOpen, onClose };
}
