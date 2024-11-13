"use client"
import React from "react"
import styles from "@/styles/modal.module.css"
import buttonStyles from "@/styles/common.module.css"
import { S3_BUCKET_URL } from "@/junkyard/env"
import { getPokemonNumberPadded } from "@/junkyard/misc"
import { UsefulPokemon } from "@/junkyard/pokegenieParser"
import { toast } from "react-toastify"
import { usePikachuForms } from "../hooks/usePikachuForms"
import { useTranslation } from "@/junkyard/useTranslation"


export type SelectedPokemonModalProps = {
  selectedPokemon: UsefulPokemon;
  translatePokemonName: (any: any) => string;
  setSelected: (any: any) => void;
  addToTradeList: (pokemon: UsefulPokemon) => void;
  removeFromTradeList: (pokemon: UsefulPokemon) => void;
  isOnTradeList: boolean;
}

export const SelectedPokemonModal: React.FC<SelectedPokemonModalProps> = ({
  selectedPokemon, 
  setSelected, 
  addToTradeList, 
  removeFromTradeList,
  isOnTradeList, 
  translatePokemonName
}) => {
  const { getPikachuForm, loadPikachuForms } = usePikachuForms()
  const { t } = useTranslation()
  React.useEffect(() => {
    if (selectedPokemon.pokemonNumber === 25) {
      loadPikachuForms()
    }
  }, [selectedPokemon, loadPikachuForms])

  const pikachuForm = selectedPokemon.pokemonNumber === 25 
    ? getPikachuForm(selectedPokemon.imageId) 
    : undefined

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href)
    toast.success(t('urlCopied'))
  }

  return (
    <div
      onClick={() => setSelected(null)}
      className={styles.modalContainer}
    >
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.infoBox}>
          <div>
            <img
              className={styles.bigImg}
              src={`${S3_BUCKET_URL}/pokes/${selectedPokemon.imageId}.png`}
              alt={
                translatePokemonName(getPokemonNumberPadded(selectedPokemon.pokemonNumber) as any)
              }
            >
            </img>
          </div>
          <div className={styles.right}>
            <div className={styles.modalName}>
              {translatePokemonName(getPokemonNumberPadded(selectedPokemon.pokemonNumber) as any)}
              {' '}
              <span className={styles.modalNumber}>
                #
                {selectedPokemon.pokemonNumber}
              </span>
            </div>
            {pikachuForm && (
              <div className={styles.modalForm}>
                {t(`pikachuForms.${pikachuForm}`)}
              </div>
            )}
            <div className={styles.modalCp}>
              CP:
              {selectedPokemon.cp}
            </div>
            {
              window?.location.toString() === "http://localhost:3000/"  && (
                <div className={styles.modalCp}>
                  shiny output:
                  {selectedPokemon.shinyOutput}
                </div>
              )
            }
            <div className={styles.modalCaptured}>
              {t("capturedAt")}
              :
              {' '}
              {selectedPokemon.captureDate}
            </div>
            {isOnTradeList ? (
              <button
                className={`${buttonStyles.button} ${styles.modalButton}`}
                onClick={() => removeFromTradeList(selectedPokemon)}
              >
                {t('removeFromShortlist')}
                <img 
                  width={25} 
                  src="./star.svg" 
                  alt="star"
                />
              </button>
            ) : (
              <button
                className={`${buttonStyles.button} ${styles.modalButton}`}
                onClick={() => addToTradeList(selectedPokemon)}
              >
                {t('addToShortlist')}
                <img
                  width={25}
                  src="./star.svg"
                  alt="star"
                />
              </button>
            )}
          </div>
        </div>
        
        <button
          className={`${buttonStyles.button} ${styles.shareButton}`}
          onClick={handleShare}
        >
          {t('share')}
        </button>
      </div>
    </div>
  )
}
