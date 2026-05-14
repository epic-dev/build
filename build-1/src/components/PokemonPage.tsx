import React, { type FC, useState, useDeferredValue, Suspense, useReducer, useContext, useCallback, useEffect } from "react";

import { PokemonDetails } from "./PokemonDetails";
import { useFetchData } from "../hooks/useFetchData";
import { AppContext, AppDispatchContext } from "../AppContext";

export type PokemonName = string & { readonly __brand: 'PokemonName' };
export type Pokemon = {
    url: string
    name: PokemonName
}
export interface IPokemonPage { }
export const PokemonPage: FC<IPokemonPage> = () => {
    const LIMIT = 20
    const [query, setQuery] = useState('')
    const [offset, setOffset] = useState(0)
    const [selectedPok, setSelectedPok] = useState<Pokemon | undefined>()
    const deferredQuery = useDeferredValue(query);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
    }
    const loadNextPage = useCallback(() => {
        setOffset(o => o + LIMIT)
    }, [])
    const loadPrevPage = useCallback(() => {
        setOffset(o => o !== 0 ? o - LIMIT : o)
    }, [])
    const fetchState = useFetchData<{ results: Pokemon[] }>(`pokemon?offset=${offset}`)
    const selectPokemon = useCallback((pok: Pokemon) => {
        console.log('selected', pok.name)
        setSelectedPok(pok)
    }, [])
    const goBack = useCallback(() => {
        setSelectedPok(undefined)
    }, [])

    return (
        <>
            <label>
                search by name:
                <input onChange={handleChange} value={query} />
            </label>
            {
                selectedPok
                    ? <>
                        <button onClick={() => goBack()}>back</button>
                        <PokemonDetails pokemon={selectedPok} />
                    </>
                    : <Suspense fallback={<h3>Loading...</h3>}>
                        {
                            fetchState.status === 'success' &&
                            <PokemonList pokemons={fetchState.data?.results} filter={deferredQuery} selectPokemon={selectPokemon} />
                        }
                        <button onClick={loadPrevPage}>load prev</button>
                        <button onClick={loadNextPage}>load next</button>
                    </Suspense>
            }


        </>
    )
}

interface IPokemonList {
    pokemons?: Pokemon[]
    filter?: string
    selectPokemon: (pok: Pokemon) => void
}
const PokemonList: FC<IPokemonList> = ({ pokemons, filter, selectPokemon }) => {
    const [poks, setPoks] = useState(pokemons)
    useEffect(() => {
        if (filter) {
            setPoks(pokemons?.filter((p) => { return p.name.includes(filter)}))
        } else {
            setPoks(pokemons)
        }
    }, [filter])
    return <>
        {poks?.map((pok: Pokemon) => <PokemonItem key={pok.name} pokemon={pok} onSelect={() => selectPokemon(pok)} />)}
    </>
}

interface IPokemonItem {
    pokemon: Pokemon
    onSelect: () => void
}
export const PokemonItem: FC<IPokemonItem> = React.memo(({ pokemon, onSelect }) => {
    const dispatch = useContext(AppDispatchContext)
    const ctx = useContext(AppContext)
    const isFavorite = useCallback((name: string) => {
        return ctx?.favorite.includes(name) ?? false
    }, [ctx])
    const toggleFavorite = useCallback((name: PokemonName) => {
        const action = isFavorite(name) ? 'remove' : 'add'
        dispatch({ type: action, name })
    }, [ctx, dispatch, isFavorite])
    const memoisedOnSelect = useCallback(() => onSelect(), [onSelect])
    const memoisedToggleFavorite = useCallback(() => toggleFavorite(pokemon.name), [toggleFavorite, pokemon.name])
    return <div>
        <span onClick={memoisedOnSelect}>{pokemon.name}</span>
        <input type="checkbox" checked={isFavorite(pokemon.name)} onChange={memoisedToggleFavorite} />
    </div>
})

