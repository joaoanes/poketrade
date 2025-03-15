/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useEffect, useMemo } from "react"
import { UsefulPokemon } from "@/junkyard/pokegenieParser"
import VirtualPokeList from "./VirtualPokeList"
import GroupedPikachuList from "./GroupedPokemonList"
import { Tab, TabId } from "@/data/tabs"
import layoutStyles from "@/styles/layout.module.css"
import { PikachuFormKeys, usePikachuForms } from "@/hooks/usePikachuForms"
import { defaultPlaceholder } from "./DelayedLazyLoad"
import { useTranslation } from "@/junkyard/useTranslation"
import { getPokemonNumberPadded } from "@/junkyard/misc"
import { LanguageTranslator, PokemonIds } from "@/providers/LanguageProvider"

type TabRendererProps = GenericTabProps & {
  tabs: Tab[],
  activeTab: Tab['id'] | undefined
}

type GenericTabProps = {
  filteredPokemons: UsefulPokemon[],
  setSelected: (pokemon: UsefulPokemon) => void,
  t: LanguageTranslator
}

type PikachuRendererProps = GenericTabProps & {
  isLoaded: boolean,
  getPikachuForm: (arrayId: string) => PikachuFormKeys | undefined
}

type PokedexRendererProps = GenericTabProps & {
  getPikachuForm: (arrayId: string) => PikachuFormKeys | undefined,
  translatePokemonName: (id: PokemonIds) => string
}

type GenericRendererProps = GenericTabProps & {
  tabKey: Tab['id'] | undefined
}

const GenericRenderer: React.FC<GenericRendererProps> = React.memo(({
  setSelected, filteredPokemons, tabKey 
}) => (
  (
    <VirtualPokeList
      setSelected={setSelected}
      pokemons={filteredPokemons}
      key={tabKey}
    />
  )
))

const ShortlistRenderer: React.FC<GenericTabProps> = React.memo(({
  filteredPokemons, t, setSelected 
}) => {
  if (filteredPokemons.length === 0) {
    return (
      <div className={layoutStyles.instructionsContainer}>
        <div className={layoutStyles.instructions}>
          <div className={layoutStyles.instructionsTitle}>
            {t('instructionsTitle')}
          </div>
          {t('instructions')}
          <div className={layoutStyles.messageText}>
            <div>{t('shortlistIntro')}</div>
            <div className={layoutStyles.smallText}>{t('shortlistIntro2')}</div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <VirtualPokeList
      setSelected={setSelected}
      pokemons={filteredPokemons}
      key='shortlist'
    />
  )
})

const PikachuRenderer: React.FC<PikachuRendererProps> = React.memo(({
  isLoaded, filteredPokemons, setSelected, getPikachuForm, t 
}) => (
  isLoaded ? (
    <GroupedPikachuList
      pokemons={filteredPokemons}
      setSelected={setSelected}
      getPikachuForm={getPikachuForm}
      getGroupKey={(pokemon) => getPikachuForm(pokemon.imageId) || ''}
      getGroupTitle={(form) =>
        t(`pikachuForms.${(form as PikachuFormKeys)}`)}
    />
  ) : (
    <div className={layoutStyles.loading}>
      <div className={layoutStyles.loadingPlaceholder}>
        {defaultPlaceholder}
      </div>
      <div className={layoutStyles.loadingText}>{t('loading')}</div>
    </div>
  )
))

const PokedexRenderer: React.FC<PokedexRendererProps> = React.memo(({
  filteredPokemons, setSelected, getPikachuForm, translatePokemonName 
}) => (
  <GroupedPikachuList
    key='pokedex'
    pokemons={filteredPokemons}
    setSelected={setSelected}
    getPikachuForm={getPikachuForm}
    getGroupKey={(pokemon) =>
      getPokemonNumberPadded(pokemon.pokemonNumber)}
    getGroupTitle={(number) =>
      `#${number} - ${translatePokemonName(number as any)}`}
  />
))

const TabRenderer: React.FC<TabRendererProps> = ({
  activeTab,
  filteredPokemons,
  setSelected,
  tabs
}) => {
  const { t, translatePokemonName } = useTranslation()
  const {
    loadPikachuForms, getPikachuForm, isLoaded 
  } = usePikachuForms()

  useEffect(() => {
    if (activeTab === 'pikachu') {
      loadPikachuForms()
    }
  }, [activeTab, loadPikachuForms])

  const currentTab = useMemo(() => tabs.find((tab) => tab.id === activeTab), [
    tabs,
    activeTab
  ])

  const RenderedTabContent = renderContent(
    activeTab, 
    filteredPokemons, 
    setSelected, 
    t, 
    getPikachuForm,
    isLoaded,
    translatePokemonName
  )

  return (
    <div className={layoutStyles.containerWrapper}>
      {activeTab !== 'shortlist' && currentTab && currentTab.title && (
        <div className={layoutStyles.tabTitleContainer}>
          <div className={layoutStyles.tabTitle}>{currentTab.title}</div>
          <div className={layoutStyles.tabSubtitle}>{currentTab.subtitle}</div>
        </div>
      )}
      <div className={layoutStyles.containerContainer}>
        {RenderedTabContent}
      </div>
    </div>
  )
}

export default TabRenderer

const renderContent = (
  activeTab: TabId | undefined, 
  filteredPokemons: UsefulPokemon[], 
  setSelected: (pokemon: UsefulPokemon) => void, 
  t: LanguageTranslator, 
  getPikachuForm: (imageId: string) => PikachuFormKeys | undefined, 
  isLoaded: boolean, 
  translatePokemonName: (id: PokemonIds) => string
) => {
  switch (activeTab) {
    case 'shortlist':
      return (
        <ShortlistRenderer
          filteredPokemons={filteredPokemons}
          setSelected={setSelected}
          t={t}
        />
      )
    case 'pikachu':
      return (
        <PikachuRenderer
          filteredPokemons={filteredPokemons}
          getPikachuForm={getPikachuForm}
          isLoaded={isLoaded}
          setSelected={setSelected}
          t={t}
        />
      )
    case 'pokedex':
      return (
        <PokedexRenderer
          filteredPokemons={filteredPokemons}
          getPikachuForm={getPikachuForm}
          translatePokemonName={translatePokemonName}
          setSelected={setSelected}
          t={t}
        />
      )
    default:
      return (
        <GenericRenderer
          filteredPokemons={filteredPokemons}
          setSelected={setSelected}
          t={t}
          tabKey={activeTab}
        />
      )
  }
}
