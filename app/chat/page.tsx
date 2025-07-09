import ChatBox from '@/components/ChatBox'
import InputBar from '@/components/InputBar'
import ModelSelector from '@/components/ModelSelector'

export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <ModelSelector />
      <ChatBox />
      <InputBar />
    </div>
  )
}
