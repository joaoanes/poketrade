"use client"

import React, { Suspense } from "react"
import { useSearchParams } from 'next/navigation'
import { Home } from "@/components/Home"
import SelectionWrapper from "@/components/SelectionWrapper"
import { UrlStateProvider } from '@/providers/UrlStateProvider'
import { LanguageProvider } from "@/providers/LanguageProvider"

const AppContent = () => {
  const searchParams = useSearchParams()
  const isSelectionMode = searchParams.get('selection') === 'veryyes'

  const content = (
    <UrlStateProvider>
      <LanguageProvider>
        <Home />
      </LanguageProvider>
    </UrlStateProvider>
  )

  return isSelectionMode ? (
    <SelectionWrapper>
      {content}
    </SelectionWrapper>
  ) : content
}

const App = () => {
  return (
    <Suspense fallback={null}>
      <AppContent />
    </Suspense>
  )
}

export default App
