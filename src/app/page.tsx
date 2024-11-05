"use client"

import React from "react"
import { useSearchParams } from 'next/navigation'
import { LanguageProvider } from '../junkyard/useTranslation'
import { Home } from "@/components/Home"
import SelectionWrapper from "@/components/SelectionWrapper"

const App = () => {
  const searchParams = useSearchParams()
  const isSelectionMode = searchParams.get('selection') === 'veryyes'

  const content = (
    <LanguageProvider>
      <Home />
    </LanguageProvider>
  )

  return isSelectionMode ? (
    <SelectionWrapper>
      {content}
    </SelectionWrapper>
  ) : content
}

export default App
