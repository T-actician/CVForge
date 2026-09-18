"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CVData, SectionType, emptyCV } from "@/lib/cvTypes";

interface CVStore {
  templateId: string;
  cv: CVData;
  setTemplateId: (id: string) => void;
  setCV: (cv: CVData) => void;
  updateField: <K extends keyof CVData>(key: K, value: CVData[K]) => void;
  toggleSection: (section: SectionType) => void;
  moveSection: (section: SectionType, direction: "up" | "down") => void;
  reset: () => void;
}

// Persisted to the browser's own localStorage so a returning visitor's CV
// data auto-fills instead of retyping everything from scratch. skipHydration
// is required because this store module is also evaluated during Next.js's
// server-side render pass (before localStorage exists) — the builder page
// triggers the actual rehydration once mounted in the browser.
export const useCVStore = create<CVStore>()(
  persist(
    (set, get) => ({
      templateId: "modern-classic",
      cv: emptyCV(),
      setTemplateId: (id) => set({ templateId: id }),
      setCV: (cv) => set({ cv }),
      updateField: (key, value) =>
        set((state) => ({ cv: { ...state.cv, [key]: value } })),
      toggleSection: (section) =>
        set((state) => ({
          cv: {
            ...state.cv,
            visibleSections: {
              ...state.cv.visibleSections,
              [section]: !state.cv.visibleSections[section],
            },
          },
        })),
      moveSection: (section, direction) => {
        const order = [...get().cv.sectionOrder];
        const idx = order.indexOf(section);
        const swapWith = direction === "up" ? idx - 1 : idx + 1;
        if (swapWith < 0 || swapWith >= order.length) return;
        [order[idx], order[swapWith]] = [order[swapWith], order[idx]];
        set((state) => ({ cv: { ...state.cv, sectionOrder: order } }));
      },
      reset: () => set({ cv: emptyCV() }),
    }),
    {
      name: "vitae-cv-data",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);
