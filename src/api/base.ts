export function createHttpClient(baseURL: string) {
  return async function http<T>(path: string, config: RequestInit = {}): Promise<T> {
    const url = baseURL + path
    const response = await fetch(url, config)

    if (!response.ok)            // modern style
      throw new Error(await response.text())

    return response.json()
  }
}

export interface ApiResponse<T> {
  status: {
    code: number
    message: string
  }
  result: T
}

export const api = createHttpClient('http://localhost:5175/api')
export const serverApi = createHttpClient('http://localhost:4000')