export type SSEEventType = 'token' | 'result' | 'error' | 'message' | (string & {})
export interface SSEEvent<T = unknown> {
  event: SSEEventType
  data: T
}
export interface StreamOptions<TToken = unknown, TResult = unknown, TError = unknown>
  extends RequestInit {
  onToken?: (data: TToken) => void
  onResult?: (data: TResult) => void
  onError?: (data: TError) => void
  onEvent?: (event: SSEEvent) => void
}

async function fetchJson<T>(url: string, config: RequestInit = {}): Promise<T> {
  const response = await fetch(url, config)
  
  if (!response.ok)
    throw new Error(await response.text())
  return response.json()
}

async function fetchStream<TToken, TResult, TError>(
  url: string, 
  options: StreamOptions<TToken, TResult, TError> = {}
): Promise<TResult | undefined> {
  const {
    onToken,
    onResult,
    onError,
    onEvent,
    ...fetchInit } = options

  const response = await fetch(url, {
    ...fetchInit,
    headers: {
      'Accept': 'text/event-stream',
      ...(fetchInit.headers || {}),
    }
  })

  if (!response.ok)
    throw new Error(await response.text())

  if (!response.body) {
    throw new Error('ReadableStream not supported in this environment.')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''
  let lastResult: TResult | undefined

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })

    const rawEvents = buffer.split('\n\n')
    buffer = rawEvents.pop() || ''

    for (const rawEvent of rawEvents) {
      if (!rawEvent.trim()) continue

      const lines = rawEvent.split('\n')
      // the default event type is 'message'
      let eventType: SSEEventType = 'message'
      let dataLine = ''

      for (const line of lines) {
        if (line.startsWith('event:')) {
          eventType = line.replace('event:', '').trim()
        } else if (line.startsWith('data:')) {
          dataLine += line.replace('data:', '').trim()
        }
      }

       if (!dataLine) continue

      let json: unknown
      try {
        json = JSON.parse(dataLine)
      } catch (e) {
        console.error('Failed to parse SSE JSON:', dataLine)
        continue
      }

      onEvent?.({ event: eventType, data: json })

      if (eventType === 'token') {
        onToken?.(json as TToken)
      } else if (eventType === 'result') {
        lastResult = json as TResult
        onResult?.(lastResult)
      } else if (eventType === 'error') {
        onError?.(json as TError)
      }
    }
  }

  return lastResult
}

interface HttpClient {
  <T>(path: string, config?: RequestInit): Promise<T>
  stream<TToken, TResult, TError>(
    path: string, 
    options?: StreamOptions<TToken, TResult, TError>
  ): Promise<TResult | undefined>
}

function createHttpClient(baseURL: string) {
  const client = (async function http<T>(
    path: string, 
    config: RequestInit = {}
  ) {
    return await fetchJson<T>(baseURL + path, config)
  }) as HttpClient

  client.stream = async function stream<TToken, TResult, TError>(
    path: string, 
    options: StreamOptions<TToken, TResult, TError> = {}
  ) {
    return await fetchStream(baseURL + path, options)
  }

  return client
}

export const api = createHttpClient('http://localhost:5173/api')