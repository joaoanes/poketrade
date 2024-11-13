import { TranslationKeys } from "@/providers/LanguageProvider"
import { useState, useRef, useCallback } from "react"

export type PikachuFormKeys = Extract<TranslationKeys, `pikachuForms.${string}`> extends `pikachuForms.${infer R}` ? R : never

export type PikachuFormMap = [string, PikachuFormKeys][]

export const usePikachuForms = () => {
  const [pikachuForms, setPikachuForms] = useState<PikachuFormMap | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const loadingRef = useRef(false)

  const loadPikachuForms = useCallback(async () => {
    if (loadingRef.current || pikachuForms) return
    loadingRef.current = true
    setIsLoading(true)

    try {
      const { default: forms } = await import('../data/pikachus.json')
      setPikachuForms(forms as PikachuFormMap)
    } catch (error) {
      console.error('Failed to load Pikachu forms:', error)
    } finally {
      loadingRef.current = false
      setIsLoading(false)
    }
  }, [pikachuForms])

  const getPikachuForm = useCallback((imageId: string): PikachuFormKeys | undefined => {
    if (!pikachuForms) return undefined
    const form = pikachuForms.find(([id]) => id === imageId)
    return form ? form[1] : undefined
  }, [pikachuForms])

  return { 
    loadPikachuForms, 
    getPikachuForm, 
    isLoading,
    isLoaded: !!pikachuForms 
  }
}
