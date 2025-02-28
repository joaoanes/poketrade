/* eslint-disable react/display-name */
import { UsefulPokemon } from "@/junkyard/pokegenieParser"
import React, { useEffect } from "react"
import VirtualPokeList from "./VirtualPokeList"
import GroupedPikachuList from "./GroupedPokemonList"
import { Tab } from "@/data/tabs"


import layoutStyles from "@/styles/layout.module.css"
import { PikachuFormKeys, usePikachuForms } from "@/hooks/usePikachuForms"
import { defaultPlaceholder } from "./DelayedLazyLoad"
import { useTranslation } from "@/junkyard/useTranslation"
import { getPokemonNumberPadded } from "@/junkyard/misc"
import { LanguageTranslator, PokemonIds } from "@/providers/LanguageProvider"

type TabRendererProps = GenericTabProps & {
  tabs: Tab[],
  activeTab: Tab['id'] | undefined;
}

type GenericTabProps = {
  filteredPokemons: UsefulPokemon[];
  setSelected: (pokemon: UsefulPokemon) => void
  t: LanguageTranslator
}

type PikachuRendererProps = GenericTabProps & {
  isLoaded: boolean,
  getPikachuForm: (arrayId: string) => PikachuFormKeys | undefined
}

type PokedexRendererProps = GenericTabProps & {
  getPikachuForm: (arrayId: string) => PikachuFormKeys | undefined,
  translatePokemonName: (string: PokemonIds) => string
}

type GenericRendererProps = GenericTabProps & {
  tabKey: Tab['id'] | undefined
}

const GenericRenderer = ({
  setSelected, filteredPokemons, tabKey
}: GenericRendererProps) => {
  return (
    <VirtualPokeList
      setSelected={setSelected}
      pokemons={filteredPokemons}
      key={tabKey}
    />
  )
}

const ShortlistRenderer = ({
  filteredPokemons, t, setSelected
}: GenericTabProps) => {
  return (
    <>
      {
        filteredPokemons.length === 0 ? (
          <div className={layoutStyles.instructionsContainer}>
            <div className={layoutStyles.instructions}>
              <div className={layoutStyles.instructionsTitle}>{t("instructionsTitle")}</div>
              {t("instructions")}
            </div>
          </div>
        ) : <VirtualPokeList
          setSelected={setSelected}
          pokemons={filteredPokemons}
          key={'shortlist' satisfies Tab['id']}
        />
      }
    </>
  )
}

const PikachuRenderer = ({
  isLoaded, filteredPokemons, setSelected, getPikachuForm, t
}: PikachuRendererProps) => {
  return (

    isLoaded ? (
      <GroupedPikachuList
        pokemons={filteredPokemons}
        setSelected={setSelected}
        getPikachuForm={getPikachuForm}
        getGroupKey={(pokemon) => getPikachuForm(pokemon.imageId) || ''}
        getGroupTitle={(form) => t(`pikachuForms.${(form as PikachuFormKeys)}`)}
      />
    ) : (
      <div className={layoutStyles.loading}>
        <div className={layoutStyles.loadingPlaceholder}>{defaultPlaceholder}</div>
        <div className={layoutStyles.loadingText}>{t("loading")}</div>
      </div>
    )
  )
}

const PokedexRenderer = ({
  filteredPokemons, setSelected, getPikachuForm, translatePokemonName
}: PokedexRendererProps) => {
  return (
    <GroupedPikachuList
      key={'pokedex' satisfies Tab['id']}
      pokemons={filteredPokemons}
      setSelected={setSelected}
      getPikachuForm={getPikachuForm}
      getGroupKey={(pokemon) => getPokemonNumberPadded(pokemon.pokemonNumber)}
      getGroupTitle={(number) => `#${number} - ${translatePokemonName(number as any)}`}
    />
  )
}

const TabRenderer = ({
  activeTab, filteredPokemons, setSelected, tabs
}: TabRendererProps) => {

  const { t, translatePokemonName } = useTranslation()

  const {
    loadPikachuForms, getPikachuForm, isLoaded
  } = usePikachuForms()

  useEffect(() => {
    if (activeTab === "pikachu") {
      loadPikachuForms()
    }
  }, [activeTab, loadPikachuForms])

  let CorrectTabRenderer : React.FC
  switch (activeTab) {
    case 'shortlist':
      CorrectTabRenderer = () => (
        <ShortlistRenderer
          filteredPokemons={filteredPokemons}
          setSelected={setSelected}
          t={t}
        />
      )
      CorrectTabRenderer.displayName = "Shortlist"
      break
    
    case 'pikachu':
      CorrectTabRenderer = () => (
        <PikachuRenderer
          filteredPokemons={filteredPokemons}
          getPikachuForm={getPikachuForm}
          isLoaded={isLoaded}
          setSelected={setSelected}
          t={t}
        />
      )
      break
    
    case 'pokedex':
      CorrectTabRenderer = () => (
        <PokedexRenderer 
          filteredPokemons={filteredPokemons}
          getPikachuForm={getPikachuForm}
          translatePokemonName={translatePokemonName}
          setSelected={setSelected}
          t={t}
        />
      )
      break
  
    default: 
      CorrectTabRenderer = () => (
        <GenericRenderer
          filteredPokemons={filteredPokemons}
          setSelected={setSelected}
          t={t}
          tabKey={activeTab}
        />
      )
      break
  }

  //Don't change things here without causing the grid not to center: & > div > div > div > div
  return (
    <div className={layoutStyles.containerWrapper}>
      {activeTab !== "shortlist" && (
        activeTab && tabs.find(tab => tab.id === activeTab)?.title && (
          <div className={layoutStyles.tabTitleContainer}>
            <div className={layoutStyles.tabTitle}>
              {tabs.find(tab => tab.id === activeTab)?.title}
            </div>
            <div className={layoutStyles.tabSubtitle}>
              {tabs.find(tab => tab.id === activeTab)?.subtitle}
            </div>
          </div>
        )
      )}
      <div className={layoutStyles.containerContainer}>
        <CorrectTabRenderer />
      </div>
    </div>
  )
}

export default TabRenderer

