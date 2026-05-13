import { useEffect, useState } from "react";
import { config } from "../config";

type FetchState<T> =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: T }
    | { status: 'error'; error: Error };

export const useFetchData = <T = unknown>(query: string): FetchState<T> => {
    const [state, setState] = useState<FetchState<T>>({ status: 'idle' });

    useEffect(() => {
        const abortController = new AbortController()
        
        const fetchData = async () => {
            setState({ status: 'loading' })
            try {
                const response = await fetch(`${config.apiBase}${query}`, { signal: abortController.signal })
                if (response.ok) {
                    setState({ status: 'success', data: await response.json() })
                }
            } catch (e) {
                if (e instanceof Error && e.name !== 'AbortError') {
                    setState({ status: 'error', error: e })
                }
            }
        }
        
        fetchData()
        return () => {
            abortController.abort()
        }
    }, [query])

    return state
}