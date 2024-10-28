"use client";
import React from "react";
import styles from "../app/page.module.css";
import { S3_BUCKET_URL } from "@/junkyard/env";
import { SelectedPokemonModalProps } from '../app/page';
import { getPokemonNumberPadded } from "@/junkyard/misc";

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
              <button className={styles.button} onClick={() => removeFromTradeList(selectedPokemon)}>{t('removeFromShortlist')}</button>
            ) : (
              <button className={styles.button} onClick={() => addToTradeList(selectedPokemon)}>{t('addToShortlist')}</button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
