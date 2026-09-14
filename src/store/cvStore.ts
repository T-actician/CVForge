"use client";

import { create } from "zustand";
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

export const useCVStore = create<CVStore>((set, get) => ({
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
}));
