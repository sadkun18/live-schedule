"use client";

import { useCallback, useEffect } from "react";

export default function CreateScheduleModalToggle() {
  const open = useCallback(() => {
    const modal = document.getElementById("create-schedule-modal");
    if (modal) modal.classList.remove("hidden");
  }, []);

  const close = useCallback(() => {
    const modal = document.getElementById("create-schedule-modal");
    if (modal) modal.classList.add("hidden");
  }, []);

  useEffect(() => {
    const closeBtn = document.getElementById("close-create-schedule");
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    closeBtn?.addEventListener("click", close);
    document.addEventListener("keydown", handler);
    return () => {
      closeBtn?.removeEventListener("click", close);
      document.removeEventListener("keydown", handler);
    };
  }, [close]);

  return (
    <button
      type="button"
      onClick={open}
      className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700"
    >
      + Tambah Jadwal
    </button>
  );
}
