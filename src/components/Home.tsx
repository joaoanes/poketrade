import { convertFromArray } from "@/junkyard/conversion"
import { getPokemonNumberPadded } from "@/junkyard/misc"
import { UsefulPokemon, UsefulPokemonArray } from "@/junkyard/pokegenieParser"
import { isShiny } from "@/junkyard/shinySupport"
import { useTranslation } from "@/junkyard/useTranslation"
import { useCallback, useEffect, useMemo, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import { SelectedPokemonModal } from "./SelectedPokemonModal"
import Select from 'react-select'
import VirtualPokeList from "./VirtualPokeList"
import { ShinyCircle } from "./PokeCircle"

import mons from '../data/filteredArrayWithShiny.json'

import layoutStyles from "@/styles/layout.module.css"
import commonStyles from "@/styles/common.module.css"
import ribbonStyles from "../app/ribbon.module.css"
import 'react-toastify/dist/ReactToastify.css'

import { CollapsibleFooter } from "./CollapsibleFooter"
import { createTabs, TabId } from "@/data/tabs"
import { PikachuFormKeys, usePikachuForms } from "../hooks/usePikachuForms"
import GroupedPikachuList from './GroupedPokemonList'
import { defaultPlaceholder } from "./DelayedLazyLoad"
import { useUrlState } from '@/providers/UrlStateProvider'

const TYPED_MONS: UsefulPokemonArray[] = mons as UsefulPokemonArray[]

const useTradeList = () => {
  const [tradeList, setTradeList] = useState<UsefulPokemon[]>([])

  useEffect(() => {
    const stored = window.localStorage.getItem("cooltrainertradeList")
    if (stored !== null) {
      setTradeList(JSON.parse(stored))
    }
  }, [])

  const addPokemon = useCallback((pokemon: UsefulPokemon) => {
    setTradeList(prevList => {
      const newList = [...prevList, pokemon]
      window.localStorage.setItem("cooltrainertradeList", JSON.stringify(newList))
      return newList
    })
  }, [])

  const removePokemon = useCallback((pokemon: UsefulPokemon) => {
    setTradeList(prevList => {
      const newList = prevList.filter(p => p.imageId !== pokemon.imageId)
      window.localStorage.setItem("cooltrainertradeList", JSON.stringify(newList))
      return newList
    })
  }, [])

  return { 
    tradeList, 
    addPokemon, 
    removePokemon 
  }
}

const usePokemonFilter = (pokemons: UsefulPokemon[]) => {
  const { urlState, updateUrlState } = useUrlState()

  const filteredPokemons = useMemo(() => {
    return pokemons.filter((mon) => {
      if (!urlState.filter || urlState.filter === "ALL") {
        return true
      }
      return mon.pokemonNumber.toString().padStart(3, '0') === urlState.filter
    }).filter((e) => urlState.shiny ? isShiny(e) : true)
  }, [pokemons, urlState.filter, urlState.shiny])

  return {
    currentFilter: urlState.filter,
    setFilter: (filter: string) => updateUrlState({ filter }),
    shiniesOnly: urlState.shiny,
    setShiniesOnly: (value: boolean) => updateUrlState({ shiny: value }),
    filteredPokemons
  }
}

export const Home = () => {
  const { urlState, updateUrlState } = useUrlState()
  const allPokemons = useMemo(() => TYPED_MONS.map(convertFromArray), [])
  
  const {
    t, language, setLanguage, translatePokemonName 
  } = useTranslation()
  const {
    tradeList, addPokemon, removePokemon 
  } = useTradeList()
  const [selectedPokemon, setSelectedPkmn] = useState<UsefulPokemon | null>(() => {
    if (urlState.pokemon) {
      return allPokemons.find(p => p.imageId === urlState.pokemon) ?? null
    }
    return null
  })
  const [showTradeList, setShowTradeList] = useState(false)
  const [activeTab, setActiveTab] = useState<TabId | undefined>(() => urlState.tab)

  const tabs = useMemo(
    () => createTabs(tradeList, allPokemons, t).filter(tab => !tab.hide), 
    [tradeList, t, allPokemons]
  )
  
  const listToShow = useMemo(() => {
    const activeTabData = tabs.find(tab => tab.id === activeTab)
    return activeTabData ? activeTabData.getPokemons() : allPokemons
  }, [activeTab, tabs, allPokemons])

  const {
    currentFilter,
    setFilter,
    shiniesOnly,
    setShiniesOnly,
    filteredPokemons
  } = usePokemonFilter(listToShow)

  const {
    loadPikachuForms, getPikachuForm, isLoaded 
  } = usePikachuForms()

  useEffect(() => {
    if (activeTab === "pikachu") {
      loadPikachuForms()
    }
  }, [activeTab, loadPikachuForms])

  const setSelected = useCallback((pokemon: UsefulPokemon | null) => {
    if (pokemon?.pokemonNumber === 25) {
      loadPikachuForms()
    }
    setSelectedPkmn(pokemon)
    updateUrlState({ pokemon: pokemon?.imageId ?? null })
  }, [loadPikachuForms, updateUrlState])

  const copyFriendCodeToClipboard = useCallback(async () => {
    const friendCode = "276625381166"
    await navigator.clipboard.writeText(friendCode)
    toast.success(t('friendCodeCopied'))
  }, [t])

  const toggleLanguage = useCallback(
    () =>
      setLanguage(language === 'en' ? 'jp' : 'en'),
    [language, setLanguage]
  )

  const handleFilterChange = useCallback((e: any) => {
    const wantedMonNumber = e.value
    setFilter(wantedMonNumber)
  }, [setFilter])

  const handleChangeToTradeList = useCallback((pokemon: UsefulPokemon, isAdding: boolean) => {
    if (isAdding) {
      addPokemon(pokemon)
    } else {
      removePokemon(pokemon)
    }
    toast.success(`${translatePokemonName(getPokemonNumberPadded(pokemon.pokemonNumber) as any)} ${isAdding ? t('pokemonAddedToShortlist') : t('pokemonRemovedFromShortlist')}`)
    setSelectedPkmn(null)
  }, [addPokemon, removePokemon, t, translatePokemonName])


  const uniquePokemonNumbers = useMemo(() => {
    const listToUse = showTradeList ? tradeList : TYPED_MONS.map((mon) => convertFromArray(mon))
    return Array.from(new Set(listToUse.map(mon => mon.pokemonNumber))).map(num => getPokemonNumberPadded(num))
  }, [tradeList, showTradeList])

  const handleTabClick = useCallback((tab: TabId) => {
    const newTab = activeTab === tab ? undefined : tab
    setActiveTab(newTab)
    updateUrlState({ tab: newTab })
  }, [activeTab, updateUrlState])
  
  const toggleShinies = useCallback((value: boolean) => {
    setShiniesOnly(value)
    updateUrlState({ shiny: value })
  }, [setShiniesOnly, updateUrlState])
  
  return (
    <div className={layoutStyles.mainContainer}>
      <div className={layoutStyles.tabContainer}>
        {tabs.map((tab) => (
          <button 
            key={tab.id}
            className={`${layoutStyles.tab} ${tab.header ? layoutStyles.tabHeader : ''} ${layoutStyles[tab.id]} ${activeTab === tab.id ? layoutStyles.activeTab : ''}`}
            onClick={() => handleTabClick(tab.id)}
          >
            {activeTab === tab.id && tab.subtext && <span>{tab.subtext}</span>}
            <img 
              className={layoutStyles.star} 
              src={tab.icon} 
              alt={tab.id} 
            />
          </button>
        ))}
      </div>
      <ToastContainer
        closeOnClick
      />
      {selectedPokemon && (
        <SelectedPokemonModal
          translatePokemonName={translatePokemonName}
          selectedPokemon={selectedPokemon}
          setSelected={setSelected}
          addToTradeList={() => handleChangeToTradeList(selectedPokemon, true)}
          removeFromTradeList={() => handleChangeToTradeList(selectedPokemon, false)}
          isOnTradeList={tradeList.findIndex(p => p.imageId === selectedPokemon.imageId) !== -1}
        />
      )}
      <main className={layoutStyles.main}>
        <div className={layoutStyles.header}>
          <div
            onClick={() => toggleShinies(!shiniesOnly)}
            className={commonStyles.shinyButton}
          >
            <ShinyCircle position={"relative"} />
          </div>
          <input
            checked={shiniesOnly}
            onClick={() => toggleShinies(!shiniesOnly)}
            type='checkbox'
          >
          </input>
          <Select
            className={commonStyles.selectButton}
            backspaceRemovesValue
            value={{
              value: currentFilter,
              label: currentFilter === "ALL" ? t("all") : `#${currentFilter} - ${translatePokemonName(currentFilter as any)}`
            }}
            onChange={handleFilterChange}
            options={[
              {
                value: "ALL",
                label: t('all')
              },
              ...(
                uniquePokemonNumbers.map((num) => (
                  {
                    value: num,
                    label: `#${num} - ${translatePokemonName(num as any)}`
                  }
                ))
              )
            ]}
          />
        </div>
        <div className={layoutStyles.content}>
          {activeTab === "shortlist" && filteredPokemons.length === 0 ? (
            <div className={layoutStyles.instructionsContainer}>
              <div className={layoutStyles.instructions}>
                <div className={layoutStyles.instructionsTitle}>{t("instructionsTitle")}</div>
                {t("instructions")}
              </div>
            </div>
          ) : (
            <div className={layoutStyles.containerWrapper}>
              {activeTab && tabs.find(tab => tab.id === activeTab)?.title && (
                <div className={layoutStyles.tabTitleContainer}>
                  <div className={layoutStyles.tabTitle}>
                    {tabs.find(tab => tab.id === activeTab)?.title}
                  </div>
                  <div className={layoutStyles.tabSubtitle}>
                    {tabs.find(tab => tab.id === activeTab)?.subtitle}
                  </div>
                </div>
              )}
              <div className={layoutStyles.containerContainer}>
                {activeTab === "pikachu" ? (
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
                ) : activeTab === "pokedex" ? (
                  <GroupedPikachuList
                    key={activeTab}
                    pokemons={filteredPokemons}
                    setSelected={setSelected}
                    getPikachuForm={getPikachuForm}
                    getGroupKey={(pokemon) => getPokemonNumberPadded(pokemon.pokemonNumber)}
                    getGroupTitle={(number) => `#${number} - ${translatePokemonName(number as any)}`}
                  />
                ) : (
                  <VirtualPokeList
                    setSelected={setSelected}
                    pokemons={filteredPokemons}
                    key={activeTab}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <CollapsibleFooter
        t={t}
        showTradeList={showTradeList}
        tradeListLength={tradeList.length}
        onToggleTradeList={() => {
          setFilter("ALL")
          setShowTradeList(!showTradeList)
        }}
        onCopyFriendCode={copyFriendCodeToClipboard}
      />

      <div className={`${ribbonStyles.ribbon} ${ribbonStyles.ribbonTopRight}`} >
        <span onClick={toggleLanguage}>{language === 'en' ? '日本語' : 'English'}</span>
      </div>
    </div>
  )
}
