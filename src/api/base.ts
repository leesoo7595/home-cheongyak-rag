export const baseURL = 'http://localhost:5175/api'

async function http<T>(path: string, config: RequestInit): Promise<T> {
    const request = new Request(baseURL + path, config)
    const response = await fetch(request)
    if (!response.ok) {
        throw new Error(response.statusText)
    }
    return response.json()
}

export { http }