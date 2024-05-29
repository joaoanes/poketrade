"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import styles from "./page.module.css";
import mons from '../../public/data/filteredArray.json';
import { UsefulPokemon, UsefulPokemonArray } from "../junkyard/pokegenieParser";
import { convertFromArray } from "../junkyard/conversion";
import VirtualPokeList from "../components/VirtualPokeList";
import { useTranslation, LanguageProvider, TranslationKeys } from '../junkyard/useTranslation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TYPED_MONS: UsefulPokemonArray[] = mons as UsefulPokemonArray[];

type SelectedPokemonModalProps = {
  selectedPokemon: UsefulPokemon;
  translatePokemonName: (any: any) => string;
  setSelected: (any: any) => void;
  addToTradeList: (pokemon: UsefulPokemon) => void;
  removeFromTradeList: (pokemon: UsefulPokemon) => void;
  isOnTradeList: boolean;
  t: (arg: TranslationKeys) => string;
}

const getPokemonNumberPadded: (arg: number) => string = (pokemonNumber: number) => pokemonNumber.toString().padStart(3, '0');

const SelectedPokemonModal: React.FC<SelectedPokemonModalProps> = ({ selectedPokemon, setSelected, addToTradeList, removeFromTradeList, isOnTradeList, translatePokemonName, t }) => {
  return (
    <div onClick={() => setSelected(null)} className={styles.modalContainer}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.infoBox}>
          <div className={styles.left}>
            <img className={styles.bigImg} src={`./data/pokeimg_2/${selectedPokemon.imageId}.png`} alt={translatePokemonName(getPokemonNumberPadded(selectedPokemon.pokemonNumber) as any)}></img>
          </div>
          <div className={styles.right}>
            <div className={styles.modalName}>{translatePokemonName(getPokemonNumberPadded(selectedPokemon.pokemonNumber) as any)} <span className={styles.modalNumber}>#{selectedPokemon.pokemonNumber}</span></div>
            <div className={styles.modalCp}>CP: {selectedPokemon.cp}</div>
            <div className={styles.modalCaptured}>{t("capturedAt")}: {selectedPokemon.captureDate}</div>
            {isOnTradeList ? (
              <button className={styles.button} onClick={() => removeFromTradeList(selectedPokemon)}>{t('removeFromShortlist')}</button>
            ) : (
              <button className={styles.button} onClick={() => addToTradeList(selectedPokemon)}>{t('addToShortlist')}</button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

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
    const wantedMonNumber = e.target.value;
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

  const toggleLanguage = useCallback(() => {
    const newLang = language === 'en' ? 'jp' : 'en';
    setLanguage(newLang);
  }, [language, setLanguage]);

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
          <button className={styles.button} onClick={() => setShowTradeList(!showTradeList)}>
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

          <select onChange={handleFilterChange} className={styles.selectButton}>
            <option value="ALL">{t('all')}</option>
            {uniquePokemonNumbers.map((num, i) => (
              <option key={i} value={num}>{`#${num} - ${translatePokemonName(num as any)}`}</option>
            ))}
          </select>
        </div>
        <div className={styles.content}>
          <VirtualPokeList setSelected={setSelectedPkmn} pokemons={filteredPokemons} />
        </div>
      </main>
      <div className={styles.footer}>
        <button className={styles.button} onClick={copyFriendCodeToClipboard}>{t('friendCode')}</button>
        <div style={{textAlign: "right", marginRight: 20, fontSize: "x-small"}}>{t('instructions')}</div>
      </div>

      <div className="ribbon ribbon-top-right" onClick={toggleLanguage}>
        <span>{language === 'en' ? '日本語' : 'English'}</span>
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
