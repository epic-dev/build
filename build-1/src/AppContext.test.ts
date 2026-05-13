import { describe, it, expect } from 'vitest';
import { pokemonReducer } from './AppContext';

describe('pokemonReducer', () => {
  const initialState = { pokemons: [], favorite: ['Pikachu'] };

  it('adds a favorite when action type is add', () => {
    const nextState = pokemonReducer(initialState, { type: 'add', name: 'Charmander' });

    expect(nextState.favorite).toEqual(['Pikachu', 'Charmander']);
    expect(initialState.favorite).toEqual(['Pikachu']);
  });

  it('removes a favorite when action type is remove', () => {
    const nextState = pokemonReducer(initialState, { type: 'remove', name: 'Pikachu' });

    expect(nextState.favorite).toEqual([]);
  });

  it('clears favorites when action type is clear', () => {
    const nextState = pokemonReducer(initialState, { type: 'clear' });

    expect(nextState.favorite).toEqual([]);
  });
});
