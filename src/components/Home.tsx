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

import mons from '../../public/data/filteredArrayWithShiny.json'

import layoutStyles from "@/styles/layout.module.css"
import commonStyles from "@/styles/common.module.css"
import ribbonStyles from "../app/ribbon.module.css"
import 'react-toastify/dist/ReactToastify.css'

import { CollapsibleFooter } from "./CollapsibleFooter"

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
      const newList = prevList.filter(p => p.pokemonNumber !== pokemon.pokemonNumber)
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
  const [currentFilter, setFilter] = useState<string>("ALL")
  const [shiniesOnly, setShiniesOnly] = useState(false)

  const filteredPokemons = useMemo(() => {
    return pokemons.filter((mon) => {
      if (!currentFilter || currentFilter === "ALL") {
        return true
      }
      return mon.pokemonNumber.toString().padStart(3, '0') === currentFilter
    }).filter((e) => shiniesOnly ? isShiny(e) : true)
  }, [pokemons, currentFilter, shiniesOnly])

  return {
    currentFilter,
    setFilter,
    shiniesOnly,
    setShiniesOnly,
    filteredPokemons
  }
}

export const Home = () => {
  const {
    t, language, setLanguage, translatePokemonName 
  } = useTranslation()
  const {
    tradeList, addPokemon, removePokemon 
  } = useTradeList()
  const [selectedPokemon, setSelectedPkmn] = useState<UsefulPokemon | null>(null)
  const [showTradeList, setShowTradeList] = useState(false)

  const allPokemons = useMemo(() => TYPED_MONS.map(convertFromArray), [])
  const listToShow = useMemo(
    () => showTradeList ? tradeList : allPokemons, 
    [showTradeList, tradeList, allPokemons]
  )

  const {
    currentFilter,
    setFilter,
    shiniesOnly,
    setShiniesOnly,
    filteredPokemons
  } = usePokemonFilter(listToShow)

  const setSelected = useCallback((pokemon: UsefulPokemon) => {
    setSelectedPkmn(pokemon)
  }, [])

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

  return (
    <div className={layoutStyles.mainContainer}>
      <ToastContainer />
      {selectedPokemon && (
        <SelectedPokemonModal
          t={t}
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
            onClick={() => setShiniesOnly(!shiniesOnly)}
            className={commonStyles.shinyButton}
          >
            <ShinyCircle position={"relative"} />
          </div>
          <input
            checked={shiniesOnly}
            onClick={() => setShiniesOnly(!shiniesOnly)}
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
          <VirtualPokeList
            setSelected={setSelected}
            pokemons={filteredPokemons}
          />
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
