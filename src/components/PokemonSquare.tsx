'use client'
import styles from "@/styles/pokesquare.module.css"
import React from "react"
import DelayedLazyLoad from './DelayedLazyLoad'
import { UsefulPokemon } from "../junkyard/pokegenieParser"
import { S3_BUCKET_URL } from "@/junkyard/env"
import { isShiny } from "@/junkyard/shinySupport"
import PokeCircle from "./PokeCircle"

export type PokemonSquareProps = {
  pokemon: UsefulPokemon
  quick: boolean
  selected?: boolean
}

export const PokemonSquare: React.FC<PokemonSquareProps> = ({
  pokemon, quick, selected 
}) => {
  const shiny = isShiny(pokemon)
  return (
    <div className={`${styles.pokeSquare} ${selected ? styles.selected : ''}`}>
      {
        quick
          ? <PokeCircle
              alt={pokemon.pokemonName}
              shiny={shiny}
              src={`${S3_BUCKET_URL}/thumbs/${pokemon.imageId}.png`}
          />
          : <DelayedLazyLoad
              shiny={shiny}
              height={100}
              delay={250}
              className={styles.pokeImg}
              alt={pokemon.pokemonName}
              src={`${S3_BUCKET_URL}/thumbs/${pokemon.imageId}.png`}
          />
      }
      <div className={styles.pokeCp}>
        <span className={styles.pokeCpText}>CP</span>
        <span className={styles.pokeCpNumber}>  
          {pokemon.cp}
        </span>
      </div>
    </div>
  )
}

export default PokemonSquare
