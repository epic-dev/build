import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useFetchData } from './useFetchData';

describe('useFetchData', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should set state from idle to loading to success', async () => {
        const mockData = { name: 'Pikachu', id: 25 };
        globalThis.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockData),
            } as Response)
        );

        const { result } = renderHook(() => useFetchData('/pokemon/25'));

        // Wait for loading state
        await waitFor(() => {
            expect(result.current.status).toBe('loading');
        });

        // Wait for success state
        await waitFor(() => {
            expect(result.current.status).toBe('success');
            expect(result.current).toEqual({ status: 'success', data: mockData });
        });
    });
});
