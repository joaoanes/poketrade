import { useContext } from 'react'
import { LanguageContext, LanguageContextType } from '@/providers/LanguageProvider'

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider')
  }
  return context
}
