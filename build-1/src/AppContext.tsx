import React, { createContext, useReducer, type FC } from "react";
import type { Pokemon } from "./components/PokemonPage";

type State = {
    pokemons: Pokemon[]
    favorite: string[]
}

type Action =
    | { type: 'add'; name: string }
    | { type: 'remove'; name: string }
    | { type: 'clear' };

export const AppContext = createContext<State | null>(null)
export const AppDispatchContext = createContext<React.Dispatch<Action>>(
    () => undefined
)

export function pokemonReducer(state: State, action: Action): State {
    switch (action.type) {
        case "add":
            return {
                ...state,
                favorite: [...state.favorite, action.name],
            }
        case "remove":
            return {
                ...state,
                favorite: [...state.favorite.filter(n => n !== action.name)],
            }
        case "clear": return {
            ...state,
            favorite: []
        }
        default:
            throw new Error('no such action')
    }
}

export const AppContextProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(
        pokemonReducer,
        { pokemons: [], favorite: [] },
    )

    return <AppContext.Provider value={state}>
        <AppDispatchContext.Provider value={dispatch}>
            {children}
        </AppDispatchContext.Provider>
    </AppContext.Provider>
}