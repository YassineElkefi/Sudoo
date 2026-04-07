"use client";

import { useEffect } from "react";

interface Options {
  running: boolean;
  onTick: () => void;
}

export function useTimer({ running, onTick }: Options) {
  useEffect(() => {
    if (!running) return;
    const id = setInterval(onTick, 1000);
    return () => clearInterval(id);
  }, [running, onTick]);
}