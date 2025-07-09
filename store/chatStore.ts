import { create } from 'zustand'
import { v4 as uuid } from 'uuid'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

type ChatStore = {
  messages: Message[]
  modelId: string
  isLoading: boolean
  setModelId: (id: string) => void
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
  isLoading: false,
  
  setModelId: (id) => set({ modelId: id }),
  
  clearMessages: () => set({ messages: [] }),
  
  sendMessage: async (content: string) => {
    const userMessage: Message = { id: uuid(), role: 'user', content }
    set((state) => ({ 
      messages: [...state.messages, userMessage],
      isLoading: true 
    }))

    try {
      const res = await fetch('https://dorv2m7dbh.execute-api.us-east-1.amazonaws.com/prod/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...get().messages, userMessage],
          modelId: get().modelId
        })
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()
      const botMessage: Message = { 
        id: uuid(), 
        role: 'assistant', 
        content: data.response || 'Error: No response received'
      }
      
      set((state) => ({ 
        messages: [...state.messages, botMessage],
        isLoading: false
      }))
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = { 
        id: uuid(), 
        role: 'assistant', 
        content: 'Error: Failed to get response from Bedrock. Please check your connection and try again.'
      }
      
      set((state) => ({ 
        messages: [...state.messages, errorMessage],
        isLoading: false
      }))
    }
  }
}))
