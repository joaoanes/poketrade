/* eslint-disable @next/next/no-img-element */
'use client';
import styles from "../app/page.module.css";
import React from "react";
import DelayedLazyLoad from './DelayedLazyLoad';
import { UsefulPokemon } from "../junkyard/pokegenieParser";


export type PokemonSquareProps = {
  pokemon: UsefulPokemon
  quick: boolean
}

export const PokemonSquare: React.FC<PokemonSquareProps> = ({ pokemon, quick }) => {
  return (
    <div className={styles.pokeSquare}>
      {
        quick 
        ? <img className={styles.pokeImg} alt={pokemon.pokemonName} src={`./data/pokethumbs/${pokemon.imageId}.png`}></img>
        : <DelayedLazyLoad height={100} delay={1000}>
            <img className={styles.pokeImg} alt={pokemon.pokemonName} src={`./data/pokethumbs/${pokemon.imageId}.png`}></img>
        </DelayedLazyLoad>
  
      }
      
      <div>CP: {pokemon.cp}</div>
    </div>
  )
};

export default PokemonSquare;