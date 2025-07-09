'use client'

import { useChatStore } from '@/store/chatStore'

const models = [
  { 
    id: 'anthropic.claude-3-sonnet-20240229-v1:0', 
    name: 'Claude 3 Sonnet',
    description: 'Equilibrio entre inteligencia y velocidad'
  },
  { 
    id: 'anthropic.claude-3-haiku-20240307-v1:0', 
    name: 'Claude 3 Haiku',
    description: 'Rápido y eficiente'
  },
  { 
    id: 'amazon.titan-text-lite-v1', 
    name: 'Titan Text Lite',
    description: 'Modelo ligero de Amazon'
  },
  { 
    id: 'amazon.titan-text-express-v1', 
    name: 'Titan Text Express',
    description: 'Modelo express de Amazon'
  },
  { 
    id: 'ai21.j2-mid-v1', 
    name: 'Jurassic-2 Mid',
    description: 'Modelo intermedio de AI21'
  }
]

export default function ModelSelector() {
  const { modelId, setModelId, clearMessages } = useChatStore()

  const handleModelChange = (newModelId: string) => {
    setModelId(newModelId)
    clearMessages() // Limpiar conversación al cambiar modelo
  }

  const currentModel = models.find(m => m.id === modelId)

  return (
    <div className="border-b bg-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modelo de IA
            </label>
            <select
              value={modelId}
              onChange={(e) => handleModelChange(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {currentModel?.name}
            </div>
            <div className="text-xs text-gray-500">
              {currentModel?.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
