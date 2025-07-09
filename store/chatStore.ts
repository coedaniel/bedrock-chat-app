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
  modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
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
      // Simulate a delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const botMessage: Message = { 
        id: uuid(), 
        role: 'assistant', 
        content: `Esta es una implementación estática de demostración. Para habilitar la integración real con Amazon Bedrock, necesitarías:

1. Desplegar un backend con AWS Lambda que tenga permisos para llamar a Bedrock
2. Configurar API Gateway para exponer el endpoint
3. Actualizar este frontend para llamar a tu API real

Modelo seleccionado: ${get().modelId}
Tu mensaje fue: "${content}"`
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
        content: 'Error: Failed to process message'
      }
      
      set((state) => ({ 
        messages: [...state.messages, errorMessage],
        isLoading: false
      }))
    }
  }
}))
