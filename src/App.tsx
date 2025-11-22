import './App.css'
import { useLocalMessagesQuery } from './features/chat/hooks/queries/useLocalMessagesQuery'
import { ChatDetailPage } from './features/chat/pages/ChatDetailPage'
import { NewChatPage } from './features/chat/pages/NewChatPage'

function App() {
  const { data = [], isLoading, isError } = useLocalMessagesQuery()

  const hasMessages = data.length > 0

  if (isLoading) {
    return <div>Loading...</div>
  }
  
  if (isError) {
    return <div>Error loading messages.</div>
  }
  return hasMessages ? <ChatDetailPage /> : <NewChatPage />
}

export default App