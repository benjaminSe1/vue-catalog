export const API_BASE_URL = 'https://fakestoreapi.com'

export type ApiErrorKind = 'http' | 'network' | 'parse' | 'abort'

export class ApiError extends Error {
    public kind: ApiErrorKind;
    public status?: number;
    public url?: string;
    constructor(
        kind: ApiErrorKind,
        status?: number,
        url?: string
    ) {
        super(`API error: ${kind} ${status ? `(${status})` : ''} ${url ? `at ${url}` : ''}`);
        this.kind = kind;
        this.status = status;
        this.url = url;
    }
}

export async function apiGet<T>(path: string, opts?: { signal?: AbortSignal }): Promise<T> {
    const url = new URL(path, API_BASE_URL)
    try {
        const response = await fetch(url, { signal: opts?.signal })
        if (!response.ok) {
            throw new ApiError('http', response.status, url.toString())
        }
        try {
            return await response.json() as T
        } catch (error) {
            throw new ApiError('parse', undefined, url.toString())
        }
    } catch (error) {
        if (error instanceof ApiError) {
            throw error
        } else if (error instanceof Error && error.name === 'AbortError') {
            throw new ApiError('abort', undefined, url.toString())
        } else {
            throw new ApiError('network', undefined, url.toString())
        }
    }
}