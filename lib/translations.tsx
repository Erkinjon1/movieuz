"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface TranslationContextType {
  locale: string
  setLocale: (locale: string) => void
}

const TranslationContext = createContext<TranslationContextType>({
  locale: "uz",
  setLocale: () => {},
})

export function TranslationsProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState("uz")

  const value = {
    locale,
    setLocale,
  }

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>
}

export function useTranslations() {
  return useContext(TranslationContext)
}
