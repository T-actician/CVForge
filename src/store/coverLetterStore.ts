"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CoverLetterData, emptyLetter } from "@/lib/coverLetterTypes";

interface CoverLetterStore {
  templateId: string;
  accent: string;
  letter: CoverLetterData;
  setTemplateId: (id: string) => void;
  setAccent: (hex: string) => void;
  setLetter: (l: CoverLetterData) => void;
  updateField: <K extends keyof CoverLetterData>(key: K, value: CoverLetterData[K]) => void;
}

export const useCoverLetterStore = create<CoverLetterStore>()(
  persist(
    (set) => ({
      templateId: "classic-formal",
      accent: "#c9974a",
      letter: emptyLetter(),
      setTemplateId: (id) => set({ templateId: id }),
      setAccent: (accent) => set({ accent }),
      setLetter: (letter) => set({ letter }),
      updateField: (key, value) =>
        set((s) => ({ letter: { ...s.letter, [key]: value } })),
    }),
    {
      name: "vitae-cover-letter-data",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);
