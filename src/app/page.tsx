"use client";

import Select from 'react-select'
import React, { useState, useCallback, useMemo, useEffect } from "react";
import styles from "./page.module.css";
import ribbonStyles from "./ribbon.module.css";
import mons from '../../public/data/filteredArray.json';
import { UsefulPokemon, UsefulPokemonArray } from "../junkyard/pokegenieParser";
import { convertFromArray } from "../junkyard/conversion";
import VirtualPokeList from "../components/VirtualPokeList";
import { useTranslation, LanguageProvider, TranslationKeys } from '../junkyard/useTranslation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SelectedPokemonModal } from '../components/SelectedPokemonModal';

const TYPED_MONS: UsefulPokemonArray[] = mons as UsefulPokemonArray[];

export type SelectedPokemonModalProps = {
  selectedPokemon: UsefulPokemon;
  translatePokemonName: (any: any) => string;
  setSelected: (any: any) => void;
  addToTradeList: (pokemon: UsefulPokemon) => void;
  removeFromTradeList: (pokemon: UsefulPokemon) => void;
  isOnTradeList: boolean;
  t: (arg: TranslationKeys) => string;
}

export const getPokemonNumberPadded: (arg: number) => string = (pokemonNumber: number) => pokemonNumber.toString().padStart(3, '0');

function Home() {

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

  const filteredPokemons = useMemo(() => {
    const listToShow = showTradeList ? tradeList : TYPED_MONS.map((mon) => convertFromArray(mon));
    return listToShow.filter((mon) => {
      if (!currentFilter || currentFilter === "ALL") {
        return true;
      }
      return mon.pokemonNumber.toString().padStart(3, '0') === currentFilter;
    });
  }, [currentFilter, showTradeList, tradeList]);

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
    <div className={styles.mainContainer}>
      <ToastContainer />
      {selectedPokemon && (
        <SelectedPokemonModal
          t={t}
          translatePokemonName={translatePokemonName}
          selectedPokemon={selectedPokemon}
          setSelected={setSelectedPkmn}
          addToTradeList={addToTradeList}
          removeFromTradeList={removeFromTradeList}
          isOnTradeList={tradeList.findIndex(p => p.imageId === selectedPokemon.imageId) !== -1}
        />
      )}
      <main className={styles.main}>
        <div className={styles.header}>

          <Select
            className={styles.selectButton}
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
        <div className={styles.content}>
          <VirtualPokeList setSelected={setSelectedPkmn} pokemons={filteredPokemons} />
        </div>
      </main>
      <div className={styles.footer}>
        <button className={styles.button} onClick={copyFriendCodeToClipboard}>{t('friendCode')}</button>
        <button className={styles.button} onClick={() => {
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

const App = () => (
  <LanguageProvider>
    <Home />
  </LanguageProvider>
);

export default App;
