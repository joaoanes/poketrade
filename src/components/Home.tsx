import { convertFromArray } from "@/junkyard/conversion";
import { getPokemonNumberPadded } from "@/junkyard/misc";
import { UsefulPokemon, UsefulPokemonArray } from "@/junkyard/pokegenieParser";
import { isShiny } from "@/junkyard/shinySupport";
import { useTranslation } from "@/junkyard/useTranslation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { SelectedPokemonModal } from "./SelectedPokemonModal";
import Select from 'react-select'
import VirtualPokeList from "./VirtualPokeList";
import { ShinyCircle } from "./PokeCircle";

import mons from '../../public/data/filteredArrayWithShiny.json';

import layoutStyles from "@/styles/layout.module.css";
import commonStyles from "@/styles/common.module.css";
import ribbonStyles from "../app/ribbon.module.css";
import 'react-toastify/dist/ReactToastify.css';

const TYPED_MONS: UsefulPokemonArray[] = mons as UsefulPokemonArray[];


export const Home = () => {

    useEffect(() => {
      const localStorageTradeList = window.localStorage.getItem("cooltrainertradeList");
      if (localStorageTradeList !== null) {
        setTradeList(JSON.parse(localStorageTradeList));
      }
    }, []);
  
    const { t, language, setLanguage, translatePokemonName } = useTranslation();
    const [currentFilter, setFilter] = useState<string>("ALL");
    const [selectedPokemon, setSelectedPkmn] = useState<UsefulPokemon | null>(null);
    const [tradeList, setTradeList] = useState<UsefulPokemon[]>([]);
    const [showTradeList, setShowTradeList] = useState(false);
  
    const handleFilterChange = useCallback((e: any) => {
      const wantedMonNumber = e.value;
      setFilter(wantedMonNumber);
    }, []);
  
    const addToTradeList = useCallback((pokemon: UsefulPokemon) => {
      setTradeList(prevList => {
        const newList = [...prevList, pokemon];
        window.localStorage.setItem("cooltrainertradeList", JSON.stringify(newList));
        return newList;
      });
      toast.success(`${translatePokemonName(getPokemonNumberPadded(pokemon.pokemonNumber) as any)} ${t('pokemonAddedToShortlist')}`);
      setSelectedPkmn(null);
    }, [t, translatePokemonName]);
  
    const removeFromTradeList = useCallback((pokemon: UsefulPokemon) => {
      setTradeList(prevList => {
        const newList = prevList.filter(p => p.pokemonNumber !== pokemon.pokemonNumber);
        window.localStorage.setItem("cooltrainertradeList", JSON.stringify(newList));
        return newList;
      });
      toast.error(`${translatePokemonName(getPokemonNumberPadded(pokemon.pokemonNumber) as any)} ${t('pokemonRemovedFromShortlist')}`);
      setSelectedPkmn(null);
    }, [t, translatePokemonName]);
  
    const allPokemons = useMemo(() => {
      return TYPED_MONS.map((mon) => convertFromArray(mon));
    }, []);
    
    const [shiniesOnly, setShiniesOnly] = useState(false)
  
    const listToShow = useMemo(() => {
      return showTradeList ? tradeList : allPokemons;
    }, [showTradeList, tradeList, allPokemons]);
    
    const filteredPokemons = useMemo(() => {
      return listToShow.filter((mon) => {
        if (!currentFilter || currentFilter === "ALL") {
          return true;
        }
        return mon.pokemonNumber.toString().padStart(3, '0') === currentFilter;
      }).filter((e) => shiniesOnly ? isShiny(e) : true);
    }, [listToShow, currentFilter, shiniesOnly]);
    
    const setSelected = useCallback((pokemon : UsefulPokemon) => {
      setSelectedPkmn(pokemon);
    }, []);
  
    const copyFriendCodeToClipboard = useCallback(async () => {
      const friendCode = "276625381166";
      await navigator.clipboard.writeText(friendCode);
      toast.success(t('friendCodeCopied'));
    }, [t]);
  
    const toggleLanguage = useCallback(
      () => 
        setLanguage(language === 'en' ? 'jp' : 'en'), 
      [language, setLanguage]
    );
  
  
    const uniquePokemonNumbers = useMemo(() => {
      const listToUse = showTradeList ? tradeList : TYPED_MONS.map((mon) => convertFromArray(mon));
      return Array.from(new Set(listToUse.map(mon => mon.pokemonNumber))).map(num => getPokemonNumberPadded(num));
    }, [tradeList, showTradeList]);
  
    return (
      <div className={layoutStyles.mainContainer}>
        <ToastContainer />
        {selectedPokemon && (
          <SelectedPokemonModal
            t={t}
            translatePokemonName={translatePokemonName}
            selectedPokemon={selectedPokemon}
            setSelected={setSelected}
            addToTradeList={addToTradeList}
            removeFromTradeList={removeFromTradeList}
            isOnTradeList={tradeList.findIndex(p => p.imageId === selectedPokemon.imageId) !== -1}
          />
        )}
        <main className={layoutStyles.main}>
          <div className={layoutStyles.header}>
            <div onClick={(e) => setShiniesOnly(!shiniesOnly)} className={commonStyles.shinyButton}>
              <ShinyCircle position={"relative"} />
            </div>
            <input checked={shiniesOnly} onClick={(e) => setShiniesOnly(!shiniesOnly)} type='checkbox'></input>
            <Select
              className={commonStyles.selectButton}
              backspaceRemovesValue
              value={{value: currentFilter, label: currentFilter === "ALL" ? t("all") : `#${currentFilter} - ${translatePokemonName(currentFilter as any)}`}} 
              onChange={handleFilterChange}
              options={[
                { value: "ALL", label: t('all') },
                ...(
                  uniquePokemonNumbers.map((num, i) => (
                    {value: num, label: `#${num} - ${translatePokemonName(num as any)}`}
                  ))
                )
              ]} />
          </div>
          <div className={layoutStyles.content}>
            <VirtualPokeList setSelected={setSelected} pokemons={filteredPokemons} />
          </div>
        </main>
        <div className={layoutStyles.footer}>
          <button className={commonStyles.button} onClick={copyFriendCodeToClipboard}>{t('friendCode')}</button>
          <button className={commonStyles.button} onClick={() => {
              setFilter("ALL")
              setShowTradeList(!showTradeList)
            }}>
              {showTradeList ? t('showAll') : `${t('showShortlist')} (${tradeList.length}) `}
            </button>
            <div>{showTradeList ? (
              <div style={{ textAlign: 'center', fontSize: 12 }}>
                <div>{t('shortlistIntro')}</div>
                <div style={{fontSize: 8}}>{t('shortlistIntro2')}</div>
              </div>
            ) : (
              <div style={{ textAlign: 'center',  fontSize: 12 }}>
                <div>{t('welcome')}</div>
                <div>{t('welcome2')}</div>
              </div>
            )
            }</div>
          <div style={{textAlign: "right", marginRight: 20, fontSize: "x-small"}}>{t('instructions')}</div>
        </div>
  
        <div className={`${ribbonStyles.ribbon} ${ribbonStyles.ribbonTopRight}`} >
          <span onClick={toggleLanguage}>{language === 'en' ? '日本語' : 'English'}</span>
        </div>
      </div>
    );
  }
  