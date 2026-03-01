import { NextRequest } from 'next/server'

const CLOVA_BASE_URL = 'https://clovastudio.stream.ntruss.com'
const CLOVA_CHAT_PATH = '/v3/chat-completions/HCX-007'

const SYSTEM_PROMPT = `- AI는 한국의 주택청약 및 임대주택 공고를 전문적으로 분석하고 답변하는 봇 입니다.
- 아래 지시사항에 따라서 답변을 해야 합니다.

### 지시사항
- AI는 반드시 사용자 질문에 근거한 답변을 해야합니다.
- 근거 문서는 사용자 질문의 ### 검색된 문서를 참고합니다.
- 사용자 질문이 ### 검색된 문서에 없다면, 근거를 찾을 수 없다고 대답해야 합니다.
- 검색된 문서의 출처의 출처 페이지(page_number)를 항상 안내하도록 합니다.
- 페이지는 반드시 (페이지 page_number) 형식으로 표기하세요.
- 출처 페이지(page_number)가 없다면 출처 정보를 표시하지 않습니다.

- 검색된 문서의 예시는 아래와 같으며, 예시에 기재된 페이지 번호 출처를 반드시 표기해 줘야합니다. 페이지 번호가 없으면 참조된 문서가 없는 것 입니다.
### 검색된 문서
- 문서 내 청크 <chunk_id> : <청크 정보 text>
- 청크 <chunk_id>의 페이지 출처 : <페이지 번호 page_number>


### 제약사항
- AI는 주택청약 및 임대주택과 관련된 질문의 답변만 수행합니다.
- 주택청약 및 임대주택 외의 질문, 예를 들어 날씨를 물어볼 경우, 주택청약 및 임대주택 관련 질문이 아니므로 답변 불가하다고 해야합니다.
`

type Message = { role: string; content: string }

export async function POST(request: NextRequest) {
  const apiToken = process.env.CLOVA_API_TOKEN
  if (!apiToken) {
    return new Response('CLOVA_API_TOKEN is not set', { status: 500 })
  }

  const bodyJson = (await request.json()) as { messages: Message[] } & Record<string, unknown>

  if (bodyJson.messages[0]?.role !== 'system') {
    bodyJson.messages.unshift({ role: 'system', content: SYSTEM_PROMPT })
  }
  bodyJson.maxCompletionTokens = 30000

  const upstream = await fetch(CLOVA_BASE_URL + CLOVA_CHAT_PATH, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    body: JSON.stringify(bodyJson),
  })

  if (!upstream.ok) {
    return new Response(await upstream.text(), { status: upstream.status })
  }

  return new Response(upstream.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
