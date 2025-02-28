import React, { createContext, useState, useEffect } from 'react'
import en from '../translations/en.json'
import jp from '../translations/jp.json'
import pokemonNames from '../translations/pokemonNames.json'

export type TranslationType = 'en' | 'jp'

export type LanguageContextType = {
  t: LanguageTranslator;
  language: TranslationType;
  setLanguage: (lang: TranslationType) => void;
  translatePokemonName: (id: keyof typeof pokemonNames) => string;
}

export type TranslationKeys = keyof typeof translations["en"]

export type LanguageTranslator = (key: TranslationKeys) => string

const translations = {
  en,
  jp
} as const

export const LanguageContext = createContext<LanguageContextType | null>(null)
export type PokemonIds = keyof typeof pokemonNames

export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useState<TranslationType>('en')
  const [texts, setTexts] = useState(translations[language])
  const [pokemonTranslations] = useState(pokemonNames)

  useEffect(() => {
    setTexts(translations[language])
  }, [language])

  const t : LanguageTranslator = (key) => texts[key] || key

  

  const translatePokemonName = (id: keyof typeof pokemonNames) => {
    return (pokemonTranslations[id])?.[language] || id
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