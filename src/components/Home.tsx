import { convertFromArray } from "@/junkyard/conversion"
import { getPokemonNumberPadded } from "@/junkyard/misc"
import { UsefulPokemon, UsefulPokemonArray } from "@/junkyard/pokegenieParser"
import { isShiny } from "@/junkyard/shinySupport"
import { useTranslation } from "@/junkyard/useTranslation"
import { useCallback, useEffect, useMemo, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import { SelectedPokemonModal } from "./SelectedPokemonModal"
import { ShinyCircle } from "./PokeCircle"

import mons from '../data/filteredArrayWithShiny.json'

import layoutStyles from "@/styles/layout.module.css"
import commonStyles from "@/styles/common.module.css"
import ribbonStyles from "../app/ribbon.module.css"
import 'react-toastify/dist/ReactToastify.css'

import { CollapsibleFooter } from "./CollapsibleFooter"
import { createTabs, TabId } from "@/data/tabs"
import { usePikachuForms } from "../hooks/usePikachuForms"
import { useUrlState } from '@/providers/UrlStateProvider'
import TabRenderer from "./TabRenderer"
import dynamic from "next/dynamic"

const Select = dynamic(() => import('react-select'), { ssr: false })

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

  const {loadPikachuForms} = usePikachuForms()

  // useEffect(() => {
  //   if (activeTab === "pikachu") {
  //     loadPikachuForms()
  //   }
  // }, [activeTab, loadPikachuForms])

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
    
  }, [addPokemon, removePokemon, t, translatePokemonName])


  const uniquePokemonNumbers = useMemo(() => {
    const listToUse = activeTab === 'shortlist' ? tradeList : TYPED_MONS.map((mon) => convertFromArray(mon))
    return Array.from(new Set(listToUse.map(mon => mon.pokemonNumber))).map(num => getPokemonNumberPadded(num))
  }, [activeTab, tradeList])

  const handleTabClick = useCallback((tab: TabId) => {
    const newTab = activeTab === tab ? undefined : tab
    setActiveTab(newTab)
    updateUrlState({ tab: newTab })
  }, [activeTab, updateUrlState])
  
  const toggleShinies = useCallback((value: boolean) => {
    setShiniesOnly(value)
    updateUrlState({ shiny: value })
  }, [setShiniesOnly, updateUrlState])

  const isOnTradeList = useCallback(
    (pkmn: UsefulPokemon) => 
      tradeList.findIndex(p => p.imageId === pkmn.imageId) !== -1
    , [tradeList]
  )

  const addToTradeList = useCallback(
    (pokemon: UsefulPokemon) => handleChangeToTradeList(pokemon, true), 
    [handleChangeToTradeList]
  )

  const removeFromTradeList = useCallback(
    (pokemon: UsefulPokemon) => handleChangeToTradeList(pokemon, false), 
    [handleChangeToTradeList]
  )
  
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
          allPokemon={filteredPokemons}
          translatePokemonName={translatePokemonName}
          selectedPokemon={selectedPokemon}
          setSelected={setSelected}
          addToTradeList={addToTradeList}
          removeFromTradeList={removeFromTradeList}
          isOnTradeList={isOnTradeList}
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
            onChange={() => toggleShinies(!shiniesOnly)}
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
            instanceId={3}
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
          <TabRenderer
            activeTab={activeTab}
            filteredPokemons={filteredPokemons}
            setSelected={setSelected}
            tabs={tabs}
            t={t}
          />
        </div>
      </main>
      
      <CollapsibleFooter
        t={t}
        onCopyFriendCode={copyFriendCodeToClipboard}
      />

      <div className={`${ribbonStyles.ribbon} ${ribbonStyles.ribbonTopRight}`} >
        <span onClick={toggleLanguage}>{language === 'en' ? '日本語' : 'English'}</span>
      </div>
    </div>
  )
}
