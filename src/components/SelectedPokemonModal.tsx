"use client";
import React from "react";
import styles from "@/styles/modal.module.css";
import buttonStyles from "@/styles/common.module.css";
import { S3_BUCKET_URL } from "@/junkyard/env";
import { getPokemonNumberPadded } from "@/junkyard/misc";
import { UsefulPokemon } from "@/junkyard/pokegenieParser";
import { TranslationKeys } from "@/junkyard/useTranslation";


export type SelectedPokemonModalProps = {
  selectedPokemon: UsefulPokemon;
  translatePokemonName: (any: any) => string;
  setSelected: (any: any) => void;
  addToTradeList: (pokemon: UsefulPokemon) => void;
  removeFromTradeList: (pokemon: UsefulPokemon) => void;
  isOnTradeList: boolean;
  t: (arg: TranslationKeys) => string;
}



export const SelectedPokemonModal: React.FC<SelectedPokemonModalProps> = ({ selectedPokemon, setSelected, addToTradeList, removeFromTradeList, isOnTradeList, translatePokemonName, t }) => {
  return (
    <div onClick={() => setSelected(null)} className={styles.modalContainer}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.infoBox}>
          <div>
            <img className={styles.bigImg} src={`${S3_BUCKET_URL}/pokes/${selectedPokemon.imageId}.png`} alt={translatePokemonName(getPokemonNumberPadded(selectedPokemon.pokemonNumber) as any)}></img>
          </div>
          <div className={styles.right}>
            <div className={styles.modalName}>{translatePokemonName(getPokemonNumberPadded(selectedPokemon.pokemonNumber) as any)} <span className={styles.modalNumber}>#{selectedPokemon.pokemonNumber}</span></div>
            <div className={styles.modalCp}>CP: {selectedPokemon.cp}</div>
            {window?.location.toString() === "http://localhost:3000/" && <div className={styles.modalCp}>shiny output: {selectedPokemon.shinyOutput}</div>}
            <div className={styles.modalCaptured}>{t("capturedAt")}: {selectedPokemon.captureDate}</div>
            {isOnTradeList ? (
              <button className={buttonStyles.button} onClick={() => removeFromTradeList(selectedPokemon)}>{t('removeFromShortlist')}</button>
            ) : (
              <button className={buttonStyles.button} onClick={() => addToTradeList(selectedPokemon)}>{t('addToShortlist')}</button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
