import React, { createContext, useContext, useState, useEffect } from 'react'
import en from '../translations/en.json'
import jp from '../translations/jp.json'
import pokemonNames from '../translations/pokemonNames.json'

const translations = {
  en,
  jp
} as const

type TranslationType = keyof typeof translations

export type TranslationKeys = keyof typeof translations["en"]

type LanguageContextType = {
  t: LanguageTranslator;
  language: TranslationType;
  setLanguage: (lang: TranslationType) => void;
  translatePokemonName: (id: keyof typeof pokemonNames) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export type LanguageTranslator = (key: keyof typeof translations[TranslationType]) => string

export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useState<TranslationType>('en')
  const [texts, setTexts] = useState(translations[language])
  const [pokemonTranslations] = useState(pokemonNames)

  useEffect(() => {
    setTexts(translations[language])
  }, [language])

  const t : LanguageTranslator = (key) => texts[key] || key

  const translatePokemonName = (id: keyof typeof pokemonNames) => {
    return pokemonTranslations[id] ? pokemonTranslations[id][language] : id
  }

  return (
    <LanguageContext.Provider
      value={{
        t,
        language,
        setLanguage,
        translatePokemonName 
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider')
  }
  return context
}
