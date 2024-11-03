/* eslint-disable @next/next/no-img-element */
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
}

export const PokemonSquare: React.FC<PokemonSquareProps> = ({ pokemon, quick }) => {
  const shiny = isShiny(pokemon)
  return (
    <div className={styles.pokeSquare}>
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
              delay={1000}
              className={styles.pokeImg}
              alt={pokemon.pokemonName}
              src={`${S3_BUCKET_URL}/thumbs/${pokemon.imageId}.png`}
          />
  
      }
      
      <div>
        CP: 
        {' '}
        {pokemon.cp}
      </div>
    </div>
  )
}

export default PokemonSquare
