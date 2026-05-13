import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PokemonPage } from './PokemonPage';

const mockResults = [
  { name: 'Pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
  { name: 'Bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
];

describe('PokemonPage search filtering', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ results: mockResults }),
      }) as unknown
    ));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('filters the rendered list when the user types in the search box', async () => {
    render(<PokemonPage />);

    await screen.findByText('Pikachu');
    await screen.findByText('Bulbasaur');

    const searchInput = screen.getByLabelText(/search by name/i);
    fireEvent.change(searchInput, { target: { value: 'Bulb' } });

    await waitFor(() => {
      expect(screen.queryByText('Pikachu')).toBeNull();
    });

    expect(screen.getByText('Bulbasaur')).not.toBeNull();
  });
});
