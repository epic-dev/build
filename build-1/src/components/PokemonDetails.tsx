import { type FC } from "react";
import type { Pokemon } from "../components/PokemonPage";
import { useFetchData } from "../hooks/useFetchData";


type PokemonDetails = {
    abilities: {
        ability: {
            name: string
        }
    }[]
}
export const PokemonDetails: FC<{ pokemon: Pokemon }> = ({ pokemon }) => {
    const fetchState = useFetchData<PokemonDetails>(`pokemon/${pokemon.name}`)

    return <div>
        {
            fetchState.status === 'success' &&
            <div>
                {
                    fetchState.data.abilities.map(a => <p key={a.ability.name}>{a.ability.name}</p>)
                }
            </div>
        }
    </div>
}